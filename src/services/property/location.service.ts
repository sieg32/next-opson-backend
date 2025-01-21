import {Location} from '../../models';
import { esQueue } from '../search/elastic.queue';

export class LocationService {
  /**
   * Adds a new location to the database.
   * @param locationData - Data for the new location
   * @returns The created location
   */
  async createLocation(locationData: {
    property_id: string;
    address: string;
    city: string;
    landmark?: string;
    coordinates: { type: 'Point'; coordinates: [number, number] };
  }): Promise<Location> {
    try {
      const location = await Location.create(locationData);
      await esQueue.add({action:'updateLocation', data:{propertyId:location.property_id, updates:location}})
      return location;
    } catch (error) {
      throw new Error(`Failed to create location: ${error.message}`);
    }
  }

  /**
   * Updates an existing location in the database.
   * @param locationId - The ID of the location to update
   * @param updateData - The updated location data
   * @returns The updated location
   */
  async updateLocation(
    propertyId: string,
    updateData: Partial<{
      address: string;
      city: string;
      landmark?: string;
      coordinates?: { type: 'Point'; coordinates: [number, number] };
    }>
  ): Promise<Location> {
    try {
      const location = await Location.findOne({ where: { property_id: propertyId } });
  
      if (!location) {
        throw new Error(`Location for property ID ${propertyId} not found.`);
      }
  
      await location.update(updateData);
      await esQueue.add({action:'updateLocation', data:{propertyId:location.property_id, updates:location}})

      return location;
    } catch (error) {
      throw new Error(`Failed to update location: ${error.message}`);
    }
  }

  /**
   * Deletes a location by its ID.
   * @param locationId - The ID of the location to delete
   * @returns A success message
   */
  async deleteLocation(locationId: number): Promise<{ message: string }> {
    try {
      const location = await Location.findByPk(locationId);

      if (!location) {
        throw new Error(`Location with ID ${locationId} not found.`);
      }

      await location.destroy();
      return { message: 'Location deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete location: ${error.message}`);
    }
  }

  /**
   * Retrieves a location by its ID.
   * @param locationId - The ID of the location to retrieve
   * @returns The location data
   */
  async getLocationById(locationId: number): Promise<Location> {
    try {
      const location = await Location.findByPk(locationId);

      if (!location) {
        throw new Error(`Location with ID ${locationId} not found.`);
      }

      return location;
    } catch (error) {
      throw new Error(`Failed to retrieve location: ${error.message}`);
    }
  }

  /**
   * Retrieves all locations for a specific property.
   * @param propertyId - The ID of the property
   * @returns The list of locations
   */
  async getLocationsByPropertyId(propertyId: string): Promise<Location[]> {
    try {
      const locations = await Location.findAll({ where: { property_id: propertyId } });
      return locations;
    } catch (error) {
      throw new Error(`Failed to retrieve locations for property: ${error.message}`);
    }
  }
}
