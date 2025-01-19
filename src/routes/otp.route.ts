import { Router } from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";


const router =  Router()

router.post('/generate', sendOtpController);
router.post('/verify', verifyOtpController)

export default router;