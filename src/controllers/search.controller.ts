import { Request, Response } from "express";
import { SearchService } from "../services/search/search.service";

const searchService = new SearchService();

export const searchController = async (req: Request, res: Response): Promise<void> => {
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
      area_min,
      area_max,
      furnished,
      parking,
      is_public,
      is_negotiable,
      is_independent,
      is_pet_friendly,
      security_deposit_max,
      security_deposit_min,
      maintenance_charge_max,
      maintenance_charge_min,
      views_min,
      views_max,
      created_before,
      created_after,
      sort,
      searchRadius,
      lat,
      long,
      page,
      pageSize,
    } = req.query;

    // Parse numeric, date, and boolean parameters
    const parsedParams = {
      query: query as string,
      property_type: property_type as string,
      bhk: bhk ? parseInt(bhk as string, 10) : undefined,
      user_id: user_id as string,
      preference: preference ? preference as string : undefined ,
      priceMax: priceMax ? parseFloat(priceMax as string) : undefined,
      priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
      property_id: property_id as string,
      city: city as string,
      landmark: landmark as string,
      bathrooms: bathrooms ? parseInt(bathrooms as string, 10) : undefined,
      area_min: area_min ? parseFloat(area_min as string) : undefined,
      area_max: area_max ? parseFloat(area_max as string) : undefined,
      furnished: furnished ? furnished === 'true' : undefined,
      parking: parking ? parking === 'true' : undefined,
      is_public: is_public ? is_public === 'true' : undefined,
      is_negotiable: is_negotiable ? is_negotiable === 'true' : undefined,
      is_independent: is_independent ? is_independent === 'true' : undefined,
      is_pet_friendly: is_pet_friendly ? is_pet_friendly === 'true' : undefined,
      security_deposit_max: security_deposit_max
        ? parseFloat(security_deposit_max as string)
        : undefined,
      security_deposit_min: security_deposit_min
        ? parseFloat(security_deposit_min as string)
        : undefined,
      maintenance_charge_max: maintenance_charge_max
        ? parseFloat(maintenance_charge_max as string)
        : undefined,
      maintenance_charge_min: maintenance_charge_min
        ? parseFloat(maintenance_charge_min as string)
        : undefined,
      views_min: views_min ? parseInt(views_min as string, 10) : undefined,
      views_max: views_max ? parseInt(views_max as string, 10) : undefined,
      created_before: created_before as string,
      created_after: created_after as string,
      sort: sort as string,
      searchRadius: searchRadius ? parseFloat(searchRadius as string) : undefined,
      lat: lat ? parseFloat(lat as string) : undefined,
      long: long ? parseFloat(long as string) : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : 30,
    };

    // Call the search service with parsed parameters
    const result = await searchService.search(parsedParams);

    // Respond with the search results
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("SearchController Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
