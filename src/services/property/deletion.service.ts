

import s3 from '../../config/s3';

import logger from "../../config/logger";

import { ImageProperty, Location, Property } from '../../models';
import { ImageService } from './images.service';
import { LocationService } from './location.service';
import { esQueue } from '../search/elastic.queue';


const imageService = new ImageService();


export class DeletionService {
  public async deleteProperty(propertyId: string): Promise<void> {
    const property = await Property.findByPk(propertyId, {
      include: [{model:ImageProperty ,as:'images'}, Location],
    });

    if (!property) {
      throw new Error("NotFound");
    }

    try {
      // Delete associated images
      if (property.images && property.images.length > 0) {
        const imageKeys = property.images.map((image) => image.key);
        const { deletedKeys, errors } = await imageService.deleteImages(imageKeys);
        console.log('deleted keyss.....................', deletedKeys)
        if (errors.length > 0) {
          logger.error("Failed to delete some images:", errors);
        }
      }

      // Delete associated brochure
      

      // Delete related database records
      
      await Location.destroy({ where: { property_id: propertyId } });
     
     
      await esQueue.add({action:'delete', data:{propertyId}});
      // Delete the project
      await property.destroy();
    } catch (error) {
      logger.error("Error while deleting project:", error.message);
      throw new Error("DeletionFailed");
    }
  }
}
