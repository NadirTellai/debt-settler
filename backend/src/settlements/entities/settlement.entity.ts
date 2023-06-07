import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Node} from "../../nodes/nodes.entity";
import {Link} from "../../links/links.entity";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Settlement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Node, (node) => node.settlement,{
        eager: true,
    } )
    nodes: Node[]

    @OneToMany(() => Link, (link) => link.settlement,{
        eager: true,
    } )
    links: Link[]

    @JoinColumn()
    user: User

    @Column()
    userId: number;
}
