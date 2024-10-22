import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Blog } from "../blog/blog.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => Blog, (blog) => blog.id)
    blog!: Blog;

    @Column('text')
    content!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
    
