import { S3Client } from '@aws-sdk/client-s3';
import config from './config'
const s3 = new S3Client({
    
    region: config.s3.AWS_REGION,
    credentials: {
        accessKeyId: config.s3.AWS_ACCESS_KEY_ID!,
        secretAccessKey: config.s3.AWS_SECRET_ACCESS_KEY!,
      
    },
})

export default s3;