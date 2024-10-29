import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/entities/user.entity";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    author: User;

    @Column()
    title: string;
    
    @Column('text')
    content: string;
    
    @Column("text", { array: true})
    tags: string[];

    @Column({default: 0})
    likes: number;

    @Column({default: 0})
    dislikes: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}