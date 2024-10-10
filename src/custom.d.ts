import { Request } from 'express';
import { User } from '../user/entities/user.entity';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;  
  }
}


declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}
