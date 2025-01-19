import { Router } from "express";
import { setUserTypeController } from "../controllers/user.controller";



const router =  Router()

router.post('/type', setUserTypeController);


export default router;