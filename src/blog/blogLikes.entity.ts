import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Blog } from "./blog.entity";

@Entity()
export class BlogLikes {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => User, {onDelete: "CASCADE"} )
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Blog, {onDelete: "CASCADE"})
    blog: Blog;

    @Column()
    blogId: string;
}