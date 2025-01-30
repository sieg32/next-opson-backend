import { Router, Request, Response } from 'express';
import { login, refreshToken, register, verifyToken } from '../controllers/authentication.controller';
import authorize from '../middlewares/authorization.middleware';


const router = Router();


router.post('/login', login)
router.post('/register', register)
router.post('/verify', authorize, verifyToken)
router.post('/refresh', authorize, refreshToken)

export default router;