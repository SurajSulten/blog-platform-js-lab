import bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;
    
    @Column()
    username: string;

    @Column()
    password: string;
    
    @Column()
    role: string; 

    async hashPassword(newPassword: string) {
        return await bcrypt.hash(newPassword, 10);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}