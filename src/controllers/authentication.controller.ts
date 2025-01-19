import { Request, Response } from "express";
import { loginService, registerService, verifyUserService } from "../services/authentication.service";
import logger from "../config/logger";
import { AuthenticatedRequest } from "../types/controllers/authenticatedRequest.type";


export const  login = async (req:Request, res: Response) =>{
    const {email, password, remember}:{email:string, password:string, remember:boolean} = req.body;

    try {
        if (!(email || password)){
            throw new Error('InvalidCredential')
            
        }
        const token = await loginService(email, password, remember);
        
        if(token){
            res.status(200).json({success:true, token:token})
        
        }
        
    } catch (error) {
        if(error.message ==='UserNotFound'){
            res.status(404).json({success:false, message:'UserNotFound'})
            
        }else if(error.message === 'InvalidCredential'){
            res.status(403).json({success:false, message:'InvalidCredential'})
        }else{
            res.status(500).json({success:false, message:'InternalServerError'})
            logger.error(error.message)
        }

    }
}
export const  register = async (req:Request, res: Response) =>{
    const { username,
        email,
        password,
        user_type}:{username:string,  email:string, password:string , user_type?:'owner' | 'broker' | 'agent' | 'builder'} = req.body;

    try {
        const token = await registerService(username, email, password);
        
        if(token){
            res.status(200).json({success:true, token:token})
        
        }
        
    } catch (error) {
        if(error.message ==='AlreadyExists'){
            res.status(403).json({success:false, message:'email already exists'})
            
        }else if(error.message === 'InvalidCredential'){
            res.status(403).json({success:false, message:'InvalidCredential'})
        }else{
            res.status(500).json({success:false, message:'InternalServerError'})
            logger.error(error.message)
        }

    }
}

export const verifyToken =async (req:AuthenticatedRequest, res:Response)=>{
    try {
        
        
        const userData =await verifyUserService(req.user);
        if(userData){
            res.status(200).json({success:true, message:'user verified', data:userData});
        }else{
            res.status(403).json({success:false, message:'user not verified'});
        }
    } catch (error) {
        logger.error(error)
        res.status(500).json({success:false, message:"internal server error"});
    }
    
    
     }


export const generateOtpController =async (req:Request, res:Response)=>{
    try {
        

        const userData =await verifyUserService(req.user);
        if(userData){
            res.status(200).json({success:true, message:'user verified', data:userData});
        }else{
            res.status(403).json({success:false, message:'user not verified'});
        }
    } catch (error) {
        logger.error(error)
        res.status(500).json({success:false, message:"internal server error"});
    }
    
    
     }