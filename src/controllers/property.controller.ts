import { Request, Response } from 'express';
import { Property, Location, ImageProperty } from '../models';
import { TextService } from '../services/property/basicText.service';
import { LocationService } from '../services/property/location.service';
import { ImageService } from '../services/property/images.service';
import { DeletionService } from '../services/property/deletion.service';

const textService = new TextService();
const locationService = new LocationService();
const imageService = new ImageService();
const deletionService = new DeletionService()

export const  getAllProperties= async (req:Request, res:Response)=>{

    const data = await Property.findAll({include:[Location, {model:ImageProperty , as:'images'}]});

    res.status(200).json({message:'success', success:true, data:data})
}


export const createProperty= async(req: Request, res: Response): Promise<void> =>{
    try {
      const data = req.body;

      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value === "" ? null : value;
        return acc;
      }, {} as Record<string, any>);

      // Call the service to create the property
      const property = await textService.createProperty(cleanedData);

      // Respond with the created property data
      res.status(201).json({
        success:true,
        message: 'Property created successfully',
        property_id: property.property_id,
        data: property,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}



export const updateProperty = async (req: Request, res: Response): Promise<void> => {
    try {
      const { propertyId } = req.params;
      const updates = req.body;

      const cleanedData = Object.entries(updates).reduce((acc, [key, value]) => {
        acc[key] = value === "" ? null : value;
        return acc;
      }, {} as Record<string, any>);
      // Call the service to update the property
      const updatedProperty = await textService.updateProperty(propertyId, cleanedData);

      // Respond with the updated property data
      res.status(200).json({
        success:true,
        message: 'Property updated successfully',
        data: updatedProperty,
      });
    } catch (error) {
        if(error.message === 'NotFound'){
            res.status(404).json({success:false, message:'property not found'})
        }else{

            res.status(400).json({ error: error.message });
        }
    }
  }



 export const deleteProperty =async (req: Request, res: Response): Promise<void> => {
    try {
      const { propertyId } = req.params;

      // Call the service to delete the property
      const result = await deletionService.deleteProperty(propertyId);

      // Respond with success message
      res.status(200).json({success:true, message:'property successfully deleted'});
    } catch (error) {

        if(error.message === 'NotFound'){

            res.status(404).json({success:false, message:'property not found'})
        }else{
            
            
            res.status(400).json({ error: error.message });
        }
    }
  }



 


export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { property_id, address, city, landmark, coordinates } = req.body;

    if (!property_id || !address || !city || !coordinates) {
      res.status(400).json({success:false, error: 'Missing required fields.' });
      return;
    }

    const location = await locationService.createLocation({
      property_id,
      address,
      city,
      landmark,
      coordinates,
    });

    res.status(201).json({success:true,location});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocationByPropertyId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const location = await locationService.getLocationsByPropertyId(propertyId);

    if (!location) {
      res.status(404).json({success:false,  error: `Location for property ID ${propertyId} not found.` });
      return;
    }

    res.status(200).json({success:true,location});
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const updatedLocation = await locationService.updateLocation(propertyId, req.body);

    if (!updatedLocation) {
      res.status(404).json({success:false, error: `Location for property ID ${propertyId} not found.` });
      return;
    }

    res.status(200).json({success:true, updatedLocation});
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const deleted = await locationService.deleteLocation(propertyId);

    if (!deleted) {
      res.status(404).json({success:false, error: `Location for property ID ${propertyId} not found.` });
      return;
    }

    res.status(200).json({success:true, message: `Location for property ID ${propertyId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};





/**
 * Upload multiple images for a property.
 */
export const uploadImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { propertyId } = req.body;
  
      // Validate files and metadata
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({success:false, message: 'No files uploaded' });
        return;
      }

      
      let metadata = req.body.metadata;
      try {
        metadata = JSON.parse(metadata); // Parse metadata from string to an array
      } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid metadata format' });
        return;
      }



      if (!metadata || !Array.isArray(metadata) || metadata.length !== req.files.length) {
        res.status(400).json({success:false, message: 'Metadata is required and must match the number of files' });
        return;
      }
  
      // Parse metadata
      const parsedMetadata :{altText:string | null , sortOrder:number | null }[] = metadata.map((meta: any) => ({
        altText: meta.alt_text || null,
        sortOrder: parseInt(meta.sort_order, 10) || null,
      }));
  
      // Call the service to upload images
      const uploadedImages = await imageService.uploadImages(
        propertyId,
        req.files as Express.Multer.File[],
        parsedMetadata
      );
  
      res.status(201).json({success:true, message: 'Images uploaded successfully', data: uploadedImages });
    } catch (error) {
      res.status(500).json({success:false, message: `Failed to upload images: ${error.message}` });
    }
  };
  
  /**
   * Delete an image by its ID.
   */
export const deleteImages = async (req: Request, res: Response): Promise<void> => {
  
    try {
      const { imageIds } = req.body;
  
      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        res.status(400).json({success:false, message: 'No image IDs provided' });
        return;
      }
  
      const deletionResults = await Promise.all(
        imageIds.map(async (imageId) => {
          try {
            const isDeleted = await imageService.deleteImage(imageId);
            return { imageId, status: isDeleted ? 'deleted' : 'not_found' };
          } catch (error) {
            return { imageId, status: 'error', error: error.message };
          }
        })
      );
  
      res.status(200).json({success:true,
        message: 'Image deletion processed',
        results: deletionResults,
      });
    } catch (error) {
      res.status(500).json({success:false, message: `Failed to process image deletion: ${error.message}` });
    }
  };