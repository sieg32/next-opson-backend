import sequelize from '../../config/database';
import logger from '../../config/logger';
import {ImageProperty} from '../../models';
import { MediaService } from "../media/media.service";
import { esQueue } from '../search/elastic.queue';
export class ImageService {
    private mediaService: MediaService;
  
    constructor() {
      this.mediaService = new MediaService('property');
    }
  
    /**
     * Uploads multiple images and creates corresponding ImageProperty records
     */
    async uploadImages(
      propertyId: string,
      files: Express.Multer.File[],
      metadata: { altText: string | null; sortOrder: number | null }[]
    ): Promise<ImageProperty[]> {
      if (files.length !== metadata.length) {
        throw new Error('Files and metadata length mismatch');
      }
    
      const transaction = await sequelize.transaction(); // Start a transaction
      const uploadedS3Keys: string[] = []; // To track successfully uploaded S3 keys
    
      try {
        const createdImages: ImageProperty[] = [];
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const { altText, sortOrder } = metadata[i];
    
          // Upload the image to S3
          const { location, key } = await this.mediaService.uploadImageToS3(file);
          uploadedS3Keys.push(key); // Keep track of uploaded S3 keys
          console.log(propertyId, location, key)
          // Create the ImageProperty record
          const image = await ImageProperty.create(
            {
              property_id: propertyId,
              key,
              url: location,
              alt_text: altText,
              sort_order: sortOrder,
            },
            { transaction }
          );
    
          createdImages.push(image);
        }
    
        await transaction.commit(); // Commit transaction
        await esQueue.add({action:'updateImages', data:{propertyId}})
        return createdImages;
      } catch (error) {
        console.log(error.message)
        await transaction.rollback(); // Rollback transaction on failure
    
        // Cleanup uploaded files from S3
        for (const key of uploadedS3Keys) {
          try {
            await this.mediaService.deleteImageFromS3(key);
          } catch (s3Error) {
            console.error(`Failed to delete S3 object with key ${key}: ${s3Error.message}`);
          }
        }
    
        throw new Error(`Failed to upload images: ${error.message}`);
      }
    }
  
    /**
     * Deletes an image from S3 and removes the ImageProperty record
     */
    async deleteImage(imageId: string): Promise<boolean> {
      try {
        const image = await ImageProperty.findByPk(imageId);
        if (!image) {
          throw new Error(`Image with ID ${imageId} not found.`);
        }
        const propertyId = image.property_id;
  
        // Use the exact S3 key for deletion
        await this.mediaService.deleteImageFromS3(image.key);
  
        // Remove the record from the database
        await image.destroy();
        await esQueue.add({action:'updateImages', data:{propertyId:propertyId}});
        return true;
      } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }

    async getImagesByPropertyId(propertyId:string){
      try {
        const images =await ImageProperty.findAll({where:{property_id:propertyId}});
        if(!images){
          throw new Error('NotFound');
        }
        return images;
      } catch (error) {
        logger.error('images not found')
        throw error;
      }

    }


    public async deleteImages(imageKeys: string[]): Promise<{ deletedKeys: string[]; errors: string[] }> {
      const deletedKeys: string[] = [];
      const errors: string[] = [];
  
      // Iterate over the array of image keys to delete them individually
      await Promise.all(
        imageKeys.map(async (key) => {
          try {
            // Delete the image from S3
            await this.mediaService.deleteImageFromS3(key);
            // Remove the image metadata from the database
            const deletedRecord = await ImageProperty.destroy({ where: {  key } });
  
            if (deletedRecord > 0) {
              deletedKeys.push(key);
            } else {
              errors.push(`No database record found for key: ${key}`);
            }
          } catch (error) {
            errors.push(`Failed to delete key: ${key}. Error: ${error.message}`);
          }
        })
      );
      return { deletedKeys, errors };
    }
  }
  