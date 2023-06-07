import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Node} from "../nodes/nodes.entity";
import {Settlement} from "../settlements/entities/settlement.entity";


@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
      () => Node,
      (node) => node.sources,
      {onDelete: "CASCADE"}
  )
  @JoinColumn()
  source: Node

  @Column()
  sourceId: number

  @ManyToOne(
      () => Node,
      (node) => node.sources,
      {onDelete: "CASCADE"}
  )
  @JoinColumn()
  target: Node
  @Column()
  targetId: number

  @ManyToOne(
      () => Settlement,
      (settlement) => settlement.links,
      {onDelete: "CASCADE"}
  )
  @JoinColumn()
  settlement: Settlement
  @Column()
  settlementId: number;
}
