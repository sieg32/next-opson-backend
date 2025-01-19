import {ImageProperty} from '../../models';
import { MediaService } from "../media/media.service";
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
      metadata: { altText: string | null, sortOrder: number | null}[]
    ): Promise<ImageProperty[]> {
      if (files.length !== metadata.length) {
        throw new Error('Files and metadata length mismatch');
      }
  
      const createdImages: ImageProperty[] = [];
  
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const { altText, sortOrder } = metadata[i];
  
          // Upload the image to S3
          const { location, key } = await this.mediaService.uploadImageToS3(file);
  
          // Create the ImageProperty record with the exact S3 key
          const image = await ImageProperty.create({
            property_id: propertyId,
            key, // Save the full key
            url: location,
            alt_text: altText,
            sort_order: sortOrder,
          });
  
          createdImages.push(image);
        }
  
        return createdImages;
      } catch (error) {
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
  
        // Use the exact S3 key for deletion
        await this.mediaService.deleteImageFromS3(image.key);
  
        // Remove the record from the database
        await image.destroy();
  
        return true;
      } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }
  }
  