import { Response } from "express";
import { User } from "./entities/user.entity";
import AppDataSource from "../database";
import { PrivateRequest } from "../shared/types/private-request.type";

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

        return res.status(200).json({message: "User demoted to regular user successfully"});     
    }
}