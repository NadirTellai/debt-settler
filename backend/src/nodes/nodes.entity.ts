import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Participant} from "../participants/entities/participant.entity";
import {Settlement} from "../settlements/entities/settlement.entity";
import {Link} from "../links/links.entity";


@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.nodes)
  @JoinColumn()
  participant: Participant
  @Column()
  participantId: number;

  @ManyToOne(
      () => Settlement,
      (settlement) => settlement.nodes,
      {onDelete: "CASCADE"}
      )
  @JoinColumn()
  settlement: Settlement
  @Column()
  settlementId: number;

  @OneToMany(() => Link, (link) => link.source)
  sources: Link[]

  @OneToMany(() => Link, (link) => link.target)
  targets: Link[]

}
