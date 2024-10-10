import bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    email!: string;
    
    @Column()
    username!: string;

    @Column()
    password!: string;
    
    @Column()
    role!: string; 

    @BeforeInsert()
    async hasPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}