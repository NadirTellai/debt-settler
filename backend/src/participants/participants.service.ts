import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Participant} from "./entities/participant.entity";
import {Not, Repository} from "typeorm";
import {Settlement} from "../settlements/entities/settlement.entity";

@Injectable()
export class ParticipantsService {
  constructor(
      @InjectRepository(Participant)
      private readonly participantRepository: Repository<Participant>,
  ) {}
  async create(createParticipantDto: CreateParticipantDto) {
      const participantExists = await this.participantRepository.exist({
          where: {name: createParticipantDto.name, userId: createParticipantDto.userId}
      });
      if(participantExists)
          throw new HttpException(
              {
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                      name: 'name exists',
                  },
              },
              HttpStatus.UNPROCESSABLE_ENTITY,
          );
      const result = this.participantRepository.create(createParticipantDto);
      return this.participantRepository.save(result)
  }

  async findAll(
    {page, limit, keyword, ids, userId}
    :{page: number, limit: number, keyword: string, ids: number[], userId: number}
  ) {
    try {
        if(limit>10) limit = 10
        let query =  this.participantRepository.createQueryBuilder('participant')
            .leftJoinAndSelect('participant.nodes', 'node')
            .where("participant.name like :keyword", { keyword: `%${keyword || ''}%` })
            .andWhere('participant.userId = :userId', {userId});
        if(ids?.length>0) query = query.where(`participant.id in (${ids.join(',')})`)

        query = query
            .select(['participant.id', 'participant.name', 'participant.avatar', 'node.id', 'participant.createdAt' ])
            .orderBy('participant.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)

        const [participants, count] = await query.getManyAndCount()
        return [
            participants.map(participant=>{
                let settlementsCount = participant.nodes.length
                delete participant.nodes
                return {...participant, settlementsCount}
            }),
            count
        ]
    } catch (e){
        throw e
    }
  }

  async findOne(id: number, userId) {
      const participant = await this.participantRepository.findOne({
        where: { id, userId }
      });
      if(participant) return participant
      throw new HttpException(
          {
              status: HttpStatus.NOT_FOUND,
              errors: {
                  participant: 'participant not found',
              },
          },
          HttpStatus.NOT_FOUND,
      );
  }

  async update(id: number, updateParticipantDto: UpdateParticipantDto) {
      const participant = await this.participantRepository.findOne({
          where: {id, userId: updateParticipantDto.userId}
      })
      if(!participant)
          throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  errors: {
                      participant: 'participant not found',
                  },
              },
              HttpStatus.NOT_FOUND,
          );
      const participantExists = await this.participantRepository.exist({
          where: {
              name: updateParticipantDto.name,
              userId: updateParticipantDto.userId,
              id: Not(id)
          }
      });
      if(participantExists)
          throw new HttpException(
              {
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                      name: 'name exists',
                  },
              },
              HttpStatus.UNPROCESSABLE_ENTITY,
          );

    return this.participantRepository.save(
        {
          id,
          ...updateParticipantDto,
        },
    );
  }

  async remove(id: number, userId: number) {
      const participant = await this.participantRepository.findOne({
          where: {id, userId}
      })
      if(!participant)
          throw new HttpException(
          {
              status: HttpStatus.NOT_FOUND,
              errors: {
                  participant: 'participant not found',
              },
          },
          HttpStatus.NOT_FOUND,
      );
    await this.participantRepository.softDelete(id);
  }
}
