import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Settlement} from "./entities/settlement.entity";
import {Node} from "../nodes/nodes.entity";
import {Link} from "../links/links.entity";

@Injectable()
export class SettlementsService {
  constructor(
      @InjectRepository(Settlement)
      private readonly settlementRepository: Repository<Settlement>,

      @InjectRepository(Node)
      private readonly nodeRepository: Repository<Node>,

      @InjectRepository(Link)
      private readonly linkRepository: Repository<Link>,
  ) {}

  async create(createSettlementDto: CreateSettlementDto) {

    // create settlement
    const settlement = await this.settlementRepository.save({
      title: createSettlementDto.title,
      userId: createSettlementDto.userId
    });

    // create nodes
    const nodes = this.nodeRepository.create(createSettlementDto.nodes.map(id=>(
        {participantId: id, settlementId: settlement.id}
    )))
    await this.nodeRepository.save(nodes)

    // create links
    const participantNodeMapper = nodes.reduce((acc, curr)=>{
      acc[curr.participantId] = curr.id
      return acc
    }, {})

    const links = this.linkRepository.create(createSettlementDto.links.map(link=>{
      return {
        sourceId: participantNodeMapper[link.source],
        targetId: participantNodeMapper[link.target],
        amount: link.amount,
        settlementId: settlement.id
      }
    }))

    await this.linkRepository.save(links)
    return settlement.id
  }


  async findAll(
      { page, limit, keyword = '', sort = 'settlement.createdAt', order = 'DESC', userId}
      :{page: number, limit: number, keyword: string, sort: string, order: 'DESC' | 'ASC', userId: number}
      ) {
    if(limit>10) limit = 10

    const settlementQuery = this.settlementRepository.createQueryBuilder('settlement')
        .where("settlement.title like :keyword", { keyword: `%${keyword}%` })
        .where("settlement.userId = :userId", { userId })
        .leftJoinAndSelect(q=>{
          return q.select('*')
              .select("links.settlementId, SUM(links.amount)", "total")
              .addSelect("COUNT(links.id)", "transactions")
              .from(Link, 'links')
              .groupBy("links.settlementId")
        }, 'links', 'links.settlementId=settlement.id')
        .select(['settlement.id', 'title', 'createdAt', 'total', 'transactions'])
        .orderBy(sort, order)
        .skip((page - 1) * limit)
        .take(limit)

    let settlements = await settlementQuery.getRawMany();
    if(settlements.length>0){
      const Participants = await this.nodeRepository.createQueryBuilder('nodes')
          .where(`settlementId in (${settlements.map(s => s.settlement_id).join(',')})`)
          .leftJoinAndSelect('nodes.participant', 'participant')
          .select(['nodes.settlementId', 'participant.id', 'participant.name', 'participant.avatar'])
          .getRawMany()
      const participantsMapper = Participants.reduce((acc, curr) => {
        if (!!acc[curr.nodes_settlementId])
          acc[curr.nodes_settlementId].push(curr)
        else acc[curr.nodes_settlementId] = [curr]
        return acc
      }, {})
      settlements = settlements.map(settlement=>{
            settlement.participants = participantsMapper[settlement.settlement_id]
            return settlement
          })
    }

    return Promise.all([
      settlements,
      settlementQuery.getCount()
    ]);
  }

  async findOne(id: number, userId: number) {
    const settlement = await this.settlementRepository
        .findOne({
          where: {id, userId},
          select: ['id', 'title', 'nodes', 'nodes']
        })

    if(!settlement)
      throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            errors: {
              settlement: 'settlement not found',
            },
          },
          HttpStatus.NOT_FOUND,
      );


    const participantNode = settlement.nodes.reduce((acc, curr)=>{
      acc[curr.id] = curr.participantId
      return acc
    }, {})


    return {
      id: settlement.id,
      title: settlement.title,
      nodes:  settlement.nodes.map(node=>node.participantId),
      links: settlement.links.map(link=>({
        amount: link.amount,
        source: participantNode[link.sourceId],
        target: participantNode[link.targetId]
      }))
    }

  }

  async update(id: number, updateSettlementDto: UpdateSettlementDto) {
    const settlement = await this.settlementRepository
        .exist({
          where: {id, userId: updateSettlementDto.userId},
        })

    if(!settlement)
      throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            errors: {
              settlement: 'settlement not found',
            },
          },
          HttpStatus.NOT_FOUND,
      );

    await this.settlementRepository.update({id, userId: updateSettlementDto.userId}, {title: updateSettlementDto.title})

    // delete all settlements nodes
    await this.nodeRepository.createQueryBuilder()
        .delete()
        .where("settlementId = :id", { id })
        .execute()

    // delete all settlements links
    await this.linkRepository.createQueryBuilder()
        .delete()
        .where("settlementId = :id", { id })
        .execute()

    // create nodes
    const nodes = this.nodeRepository.create(updateSettlementDto.nodes.map(participantId=>(
        {participantId, settlementId: id}
    )))
    await this.nodeRepository.save(nodes)

    // create links
    const participantNodeMapper = nodes.reduce((acc, curr)=>{
      acc[curr.participantId] = curr.id
      return acc
    }, {})

    const links = this.linkRepository.create(updateSettlementDto.links.map(link=>{
      return {
        sourceId: participantNodeMapper[link.source],
        targetId: participantNodeMapper[link.target],
        amount: link.amount,
        settlementId: id
      }
    }))

    await this.linkRepository.save(links)

  }

  async remove(id: number, userId: number) {
    const settlement = await this.settlementRepository.findOne({
      where: {id, userId}
    })
    if(!settlement)
      throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            errors: {
              settlement: 'settlement not found',
            },
          },
          HttpStatus.NOT_FOUND,
      );
    return this.settlementRepository.delete(id);
  }
}
