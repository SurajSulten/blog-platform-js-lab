import { Response } from "express";
import AppDataSource from "../database";
import { PrivateRequest } from "../shared/types/private-request.type";
import { User } from "./entities/user.entity";

export class UserController {
    static async updateUserRole(req: PrivateRequest, res: Response) {
        const { userId } = req.params;
        const { newRole } = req.body;

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOneBy({id: userId})

        if(!user){
            return res.status(400).json({message: "User doesn't exist"});
        }

        user.role = newRole;
        await userRepository.save(user);

        if(newRole === 'user') {
            return res.status(200).json({message: "User demoted to regular user successfully"});
        } else {
            return res.status(200).json({message: "User promoted as admin successfully"});
        }   
    }

    static async getUser(req: PrivateRequest, res: Response) {
        const userId = req.user?.id;

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOne({where: {id: userId}})

        
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }

        const { password, ...rest } = user
        
        return res.json({
            data: rest
        })
    }

    static async updateUser(req: PrivateRequest, res: Response) {
        const userId = req.user?.id;
        const {email, username, currentPassword, newPassword} = req.body;

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOneBy({id: userId})

        if(!user) {
            return res.status(400).json({message: "User does not exist"})
        } else if(!currentPassword || !(await user.validatePassword(currentPassword))) {
            return res.status(400).json({message: "Current password is incorrect or not provided"})
        } 
        if(newPassword) {
            user.password = await user.hashPassword(newPassword);
        } 
        if(email) {
            user.email = email
        }
        if(username) {
            user.username = username;
        }

        const updatedUser = await userRepository.save(user);        
        
        return res.status(200).json(updatedUser);
    }
}