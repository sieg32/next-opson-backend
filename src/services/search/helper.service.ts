import elastic from "../../config/elastic";
import { Property } from "../../models";
import { ImageService } from "../property/images.service";
const INDEX_NAME = 'properties';
const imageService = new ImageService()

export class ElasticsearchHelper {
  /**
   * Add a property to the Elasticsearch index.
   * @param property The property object to be added.
   */
  static async addProperty(property: Property): Promise<void> {
    try {
      await elastic.index({
        index: INDEX_NAME,
        id: property.property_id, // Assuming `id` is the unique identifier for the property
        body: property,
      });
      console.log(`Property added to index with ID: ${property.property_id}`);
    } catch (error) {
      console.error(`Failed to add property to index: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a property in the Elasticsearch index.
   * @param propertyId The ID of the property to be updated.
   * @param updates The fields to be updated.
   */
  static async updateProperty(propertyId: string, updates: Record<string, any>): Promise<void> {
    try {
      await elastic.update({
        index: INDEX_NAME,
        id: propertyId,
        body: {
          doc: updates,
        },
      });
      console.log(`Property updated in index with ID: ${propertyId}`);
    } catch (error) {
      console.error(`Failed to update property in index: ${error.message}`);
      throw error;
    }
  }
  static async updateLocation(propertyId: string, updates: Record<string, any>): Promise<void> {
    try {
      await elastic.update({
        index: INDEX_NAME,
        id: propertyId,
        body: {
          doc: {Location:{
            id: updates.id,
            property_id: updates.property_id,
            address: updates.address,
            city: updates.city,
            landmark: updates.landmark,
            coordinates: updates.coordinates ? {
                lat: updates.coordinates.coordinates[1],
                lon: updates.coordinates.coordinates[0]
            } : null,
            createdAt: updates.createdAt,
            updatedAt: updates.updatedAt
        } },
        },
      });
      console.log(`Property location updated in index with ID: ${propertyId}`);
    } catch (error) {
      console.error(`Failed to update property in index: ${error.message}`);
      throw error;
    }
  }
  static async updateImages(propertyId: string): Promise<void> {
    try {
      const images =await imageService.getImagesByPropertyId(propertyId)
        
      await elastic.update({
        index: INDEX_NAME,
        id: propertyId,
        body: {
          doc: {images:images}
        },
      });
      console.log(`Property images updated in index with ID: ${propertyId}`);
    } catch (error) {
      console.error(`Failed to update property in index: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a property from the Elasticsearch index.
   * @param propertyId The ID of the property to be deleted.
   */
  static async deleteProperty(propertyId: string): Promise<void> {
    try {
      await elastic.delete({
        index: INDEX_NAME,
        id: propertyId,
      });
      console.log(`Property deleted from index with ID: ${propertyId}`);
    } catch (error) {
      console.error(`Failed to delete property from index: ${error.message}`);
      throw error;
    }
  }
}
