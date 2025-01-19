import { Property } from '../../models';
import { ValidationError } from 'sequelize';

interface PropertyData {
  user_id: string;
  property_name: string;
  property_type: string;
  type: 'rent' | 'sale' | 'lease';
  bhk?: number;
  description?: string;
  price?: number;
  builtup_area?: number;
  carpet_area?: number;
  sale_type?: 'new' | 'resale';
  listed_by?: 'owner' | 'broker' | 'agent';
  bathrooms?: number;
  property_age?: string;
  city?: string;
  rera?: string;
  construction_status?: 'ready_to_move' | 'under_construction' | 'new';
}

export class TextService {
  /**
   * Validates and creates a new property in the database.
   * @param data - Object containing property data
   * @returns Promise containing the created property details
   */
  async createProperty(data: PropertyData): Promise<Property> {
    try {
      // Validate required fields
      if (!data.user_id || !data.property_name || !data.property_type || !data.type) {
        throw new Error('Missing required fields: user_id, property_name, property_type, or type.');
      }

      // Create the property in the database
      const property = await Property.create({
        user_id: data.user_id,
        property_name: data.property_name,
        property_type: data.property_type,
        type: data.type,
        bhk: data.bhk,
        description: data.description,
        price: data.price,
        builtup_area: data.builtup_area,
        carpet_area: data.carpet_area,
        sale_type: data.sale_type,
        listed_by: data.listed_by,
        bathrooms: data.bathrooms,
        property_age: data.property_age,
        city: data.city,
        rera: data.rera,
        construction_status: data.construction_status,
      });

      return property;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation Error: ${error.message}`);
      }
      throw new Error(`Error creating property: ${error.message}`);
    }
  }




  async updateProperty(
    propertyId: string,
    updates: Partial<PropertyData>
  ): Promise<Property> {
    try {
      // Find the property to update
      const property = await Property.findByPk(propertyId);

      if (!property) {
        throw new Error(`NotFound`);
      }

      // Update the property
      await property.update(updates);

      return property;
    } catch (error:Error) {
      if(error.message === 'NotFound' ){
        throw new Error('NotFound')
      }else{
        throw new Error(`error while updating property: ${error.message}`)
      }
    }
  }



  async deleteProperty(propertyId: string): Promise<{success:boolean, message: string }> {
    try {
      // Find the property by ID
      const property = await Property.findByPk(propertyId);

      if (!property) {
        throw new Error(`NotFound`);
      }

      // Delete the property
      await property.destroy();

      return { success:true ,message: 'Property deleted successfully' };
    } catch (error) {
        if(error.message === 'NotFound'){

            throw new Error(`NotFound`);
        }else{
            
            throw new Error(`Error deleting property: ${error.message}`);
        }
    }
  }
}
