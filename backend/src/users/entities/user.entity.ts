import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate, OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import {Settlement} from "../../settlements/entities/settlement.entity";
import {Participant} from "../../participants/entities/participant.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Settlement, (settlement) => settlement.user)
  settlements: Settlement[]

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Participant[]
}
