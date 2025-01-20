import express, { Request, Response } from 'express';
import config from './config/config';
import sequelize from './config/database';
import authenticationRouter from './routes/authentication.route'
import projectRouter from './routes/project.route'
import propertyRouter from './routes/property.route'
import otpRouter from './routes/otp.route'
import userRouter from './routes/user.route'


const app = express();

app.use(express.json())



app.use("/api/v1/authentication", authenticationRouter );
app.use('/api/v1/user', userRouter);
app.use("/api/v1/otp", otpRouter );
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/properties", propertyRouter)


const start =async ()=>{
  await sequelize.sync({alter:true})
  
  app.listen(config.PORT, () => {
   
      console.log(`Server running at http://localhost:${config.PORT}`);
    }); 
}
start()



  