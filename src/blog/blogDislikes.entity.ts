import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Blog } from "./blog.entity";

@Entity()
export class BlogDislikes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    userId: string;
    
    @ManyToOne(() => Blog)
    blog: Blog;

    @Column()
    blogId: string;
}