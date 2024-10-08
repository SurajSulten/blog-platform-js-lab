import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../user/entities/user.entity"
import jwt from "jsonwebtoken"

export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userRepo = getRepository(User);
        const existingUser = await userRepo.findOne({ where: {email}})

        if(existingUser) {
            return res.status(400).json({message: "User already exists"})
        }

        const user = new User();
        user.email = email;
        user.password = password;

        await userRepo.save(user);

        return res.status(201).json({message: "User registrated successfully"});
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password} = req.body;

    try{
        const userRepo = getRepository(User);
        const user = await userRepo.findOne({where: {email}})

        if(!user || !(await user.validatePassword(password))) {
            return res.status(400).json({message: "invalid credentials"});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        })

        return res.status(200).json({token})
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}