import { Request, Response } from "express";
import { SearchService } from "../services/search/search.service";
const searchService = new SearchService()
export const  searchController = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        query,
        property_type,
        bhk,
        user_id,
        preference,
        priceMax,
        priceMin,
        property_id,
        city,
        landmark,
        bathrooms,
        builtup_area_min,
        builtup_area_max,
        furnished,
        parking,
        is_public,
        sort,
        searchRadius,
        lat,
        long,
        page,
        pageSize,
      } = req.query;

      // Parse numeric and boolean parameters
      const parsedParams = {
        query: query as string,
        property_type: property_type as string,
        bhk: bhk ? parseInt(bhk as string, 10) : undefined,
        user_id: user_id as string,
        preference: preference as string,
        priceMax: priceMax ? parseFloat(priceMax as string) : undefined,
        priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
        property_id: property_id as string,
        city: city as string,
        landmark: landmark as string,
        bathrooms: bathrooms ? parseInt(bathrooms as string, 10) : undefined,
        builtup_area_min: builtup_area_min
          ? parseFloat(builtup_area_min as string)
          : undefined,
        builtup_area_max: builtup_area_max
          ? parseFloat(builtup_area_max as string)
          : undefined,
        furnished: furnished ? furnished === 'true' : undefined,
        parking: parking ? parking === 'true' : undefined,
        is_public: is_public ? is_public === 'true' : undefined,
        sort: sort as string,
        searchRadius: searchRadius
          ? parseFloat(searchRadius as string)
          : undefined,
        lat: lat ? parseFloat(lat as string) : undefined,
        long: long ? parseFloat(long as string) : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 30,
      };

      // Call the search service with parsed parameters
      const result = await searchService.search(parsedParams);

      // Respond with the search results
      res.status(200).json({success:true, ...result});
    } catch (error) {
      console.error('SearchController Error:', error);
      res.status(500).json({success:false, message: 'Internal Server Error' });
    }
  }