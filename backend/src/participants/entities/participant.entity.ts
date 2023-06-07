import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn, JoinTable, ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Node} from "../../nodes/nodes.entity";
import {Exclude} from "class-transformer";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Node, (node) => node.participant)
    nodes: Node[]

    @JoinColumn()
    user: User

    @Column()
    userId: number;
}
