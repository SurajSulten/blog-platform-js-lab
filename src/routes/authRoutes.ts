import express from 'express';
import { login, signUp } from '../auth/auth.controller';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);

export default router;
