import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import config from '../../config/config';
import { ulid } from 'ulidx';
import s3 from '../../config/s3'
import logger from '../../config/logger';

export class MediaService {
  private s3 = s3;
  private bucketName: string;

  constructor( location: 'property' | 'project') {
    
    this.bucketName = config.s3.AWS_S3_BUCKET_NAME;
    if (!this.bucketName) {
      throw new Error('Missing S3 bucket name');
    }
  }
  
  async uploadImageToS3(file: Express.Multer.File): Promise<{ key: string; location: string }> {
    // Generate the S3 key for the image
    const key = `images/${ulid()}-${file.originalname}`;
  
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };
  
    try {
      // Upload the image to S3
      const command = new PutObjectCommand(params);
        // Check the region string
      await this.s3.send(command);

      // Now that the key is known, construct the location (URL)
      const location = `https://${this.bucketName}.s3.${config.s3.AWS_REGION}.amazonaws.com/${key}`;
  
      // Return both the key and the location
      return { key, location };
    } catch (error) {
      logger.error(error.message)
      throw new Error(`Failed to upload image to S3: ${error.message}`);
    }
  }
  

  async deleteImageFromS3(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      throw new Error(`Failed to delete image from S3: ${error.message}`);
    }
  }
}
