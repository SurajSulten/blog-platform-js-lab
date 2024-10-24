import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../database';
import { User } from '../user/entities/user.entity';
import { PrivateRequest } from '../shared/types/private-request.type';
import { AccessTokenPayload } from '../shared/types/jwt-payload.type';

export const isAuthenticated = async (req: PrivateRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret') as AccessTokenPayload;
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id: decoded.userId});
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
