import { Router, Request, Response } from 'express';
import { createProperty, deleteImages, deleteProperty, getAllProperties, updateProperty, uploadImages } from '../controllers/property.controller';

import {createLocation, getLocationByPropertyId, updateLocation, deleteLocation} from '../controllers/property.controller';
import upload from '../middlewares/multer.middleware';

const router = Router()


router.get('/all', getAllProperties);

router.post('/text', createProperty);
router.patch('/text/:id', updateProperty);

router.delete('/:id', deleteProperty);



router.post('/location', createLocation); // Create a location
router.get('/location/:propertyId', getLocationByPropertyId); // Get a location by property_id
router.patch('/location/:propertyId', updateLocation); // Update a location
router.delete('/location/:propertyId', deleteLocation); // Delete a location


// images


router.post('/images', upload.array('images', 10), uploadImages);
router.delete('/images', deleteImages)




export default router;