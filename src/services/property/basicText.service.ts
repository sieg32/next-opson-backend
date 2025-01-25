import { Property } from '../../models';
import { ValidationError } from 'sequelize';
import { esQueue } from '../search/elastic.queue';

interface PropertyData {
  user_id: string;
  property_name: string;
  property_type:
    | 'house/villa'
    | 'apartment/flat'
    | 'commercial'
    | 'plot'
    | 'land'
    | 'farmhouse'
    | 'flatmates'
    | 'penthouse'
    | 'builder-floor';
  type: 'rent' | 'sale' | 'lease';
  bhk?: number;
  description?: string;
  price?: number;
  is_negotiable:boolean;
  is_independent:boolean;
  is_pet_friendly:boolean;
  security_deposit:number;
  maintenance_charge:number;
  builtup_area?: number;
  carpet_area?: number;
  sale_type?: 'new' | 'resale';
  listed_by?: 'owner' | 'broker' | 'agent';
  bathrooms?: number;
  property_age?: string;
  furnished?: 'semi' | 'fully' | 'non';
  preference?: 'boys' | 'girls' | 'family';
  is_public?: boolean;
  is_sold?: boolean;
  parking?: boolean;
  views?: number;
}

export class TextService {
  /**
   * Creates a new property in the database.
   * @param data - Object containing property data
   * @returns Promise containing the created property details
   */
  async createProperty(data: PropertyData): Promise<Property> {
    try {
      // Validate required fields
      const requiredFields = ['user_id', 'property_name', 'property_type', 'type', 'price', 'area', 'listed_by'];
      for (const field of requiredFields) {
        if (!data[field as keyof PropertyData]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Create the property
      const property = await Property.create(data);

      await esQueue.add({action:'add', data: property})
      return property;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation Error: ${error.message}`);
      }
      throw new Error(`Error creating property: ${error.message}`);
    }
  }

  /**
   * Updates an existing property.
   * @param propertyId - ID of the property to update
   * @param updates - Partial property data for update
   * @returns Promise containing the updated property details
   */
  async updateProperty(propertyId: string, updates: Partial<PropertyData>): Promise<Property> {
    try {
      // Find the property by ID
      const property = await Property.findByPk(propertyId);
      if (!property) {
        throw new Error('PropertyNotFound');
      }

      // Update the property
      await property.update(updates);
      await esQueue.add({action:'updateProperty', data:{propertyId, updates:property}});
      return property;
    } catch (error) {
      if (error.message === 'PropertyNotFound') {
        throw new Error('Property not found');
      }
      throw new Error(`Error updating property: ${error.message}`);
    }
  }

  /**
   * Deletes an existing property.
   * @param propertyId - ID of the property to delete
   * @returns Promise containing success message
   */
  async deleteProperty(propertyId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find the property by ID
      const property = await Property.findByPk(propertyId);
      if (!property) {
        throw new Error('PropertyNotFound');
      }

      // Delete the property
      await esQueue.add({action:'delete', data:{propertyId}});
      await property.destroy();
      return { success: true, message: 'Property deleted successfully' };
    } catch (error) {
      if (error.message === 'PropertyNotFound') {
        throw new Error('Property not found');
      }
      throw new Error(`Error deleting property: ${error.message}`);
    }
  }
}
