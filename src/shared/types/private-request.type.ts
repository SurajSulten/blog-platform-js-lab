import { Request } from "express";
import { User } from "../../user/entities/user.entity";

export interface PrivateRequest extends Request {
    user?: User
}