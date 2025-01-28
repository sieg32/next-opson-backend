import { Client } from '@elastic/elasticsearch';
import elastic from '../../config/elastic';

// export class SearchService {
//   private elastic: Client;

//   constructor() {
//     this.elastic = elastic;
//   }

//   public async search(params: {
//     query?: string;
//     property_type?: string;
//     bhk?: number;
//     user_id?: string;
//     preference?: string;
//     priceMax?: number;
//     priceMin?: number;
//     property_id?: string;
//     city?: string;
//     landmark?: string;
//     bathrooms?: number;
//     builtup_area_min?: number;
//     builtup_area_max?: number;
//     furnished?: boolean;
//     parking?: boolean;
//     is_public?: boolean;
//     is_negotiable:boolean;
//     is_independent:boolean;
//     is_pet_friendly:boolean;
//     security_deposit:number;
//     maintenance_charge:number;
//     sort?: string;
//     searchRadius?: number;
//     lat?: number;
//     long?: number;
//     page?: number;
//     pageSize?: number;
//   }) {
//     const {
//       query,
//       property_type,
//       bhk,
//       user_id,
//       preference,
//       priceMax,
//       priceMin,
//       property_id,
//       city,
//       landmark,
//       bathrooms,
//       area_min,
//       area_max,
//       furnished,
//       parking,
//       is_public,
//       is_negotiable,
//       is_independent,
//       is_pet_friendly,
//       security_deposit,
//       maintenance_charge,
      
//       sort,
//       searchRadius = 1,
//       lat,
//       long,
//       page = 1,
//       pageSize = 30,
//     } = params;

//     try {
//       // Build Elasticsearch query
//       const esQuery: any = {
//         index: 'properties',
//         body: {
//           query: {
//             bool: {
//               must: [],
//               filter: [],
//             },
//           },
//           sort: [],
//           size: pageSize,
//           from: (page - 1) * pageSize,
//         },
//       };

//       // Add conditions based on query parameters
//       if (query) {
//         esQuery.body.query.bool.must.push({
//           multi_match: {
//             query,
//             fields: [
//               'property_name^3',
//               'description^2',
//               'Location.address^2',
//               'Location.city^2',
//               'Location.landmark^3',
//             ],
//             fuzziness: 'AUTO',
//           },
//         });
//       }

//       if (property_type)
//         esQuery.body.query.bool.must.push({ term: { property_type } });
//       if (bhk) esQuery.body.query.bool.must.push({ term: { bhk } });
//       if (user_id) esQuery.body.query.bool.must.push({ term: { user_id } });
//       if (preference)
//         esQuery.body.query.bool.must.push({ term: { preference } });
//       if (furnished)
//         esQuery.body.query.bool.must.push({ term: { furnished } });
//       if (parking) esQuery.body.query.bool.must.push({ term: { parking } });
//       if (property_id)
//         esQuery.body.query.bool.must.push({ term: { property_id } });
//       if (city)
//         esQuery.body.query.bool.must.push({ term: { 'Location.city': city } });
//       if (landmark)
//         esQuery.body.query.bool.must.push({
//           match_phrase: { 'Location.landmark': landmark },
//         });
//       if (bathrooms)
//         esQuery.body.query.bool.must.push({ term: { bathrooms } });

//       if (searchRadius && lat && long) {
//         esQuery.body.query.bool.filter.push({
//           geo_distance: {
//             distance: `${searchRadius}m`,
//             'Location.coordinates': {
//               lat,
//               lon: long,
//             },
//           },
//         });
//       }

//       if (priceMin || priceMax) {
//         esQuery.body.query.bool.must.push({
//           range: {
//             price: {
//               gte: priceMin || 0,
//               lte: priceMax || 999999999,
//             },
//           },
//         });
//       }

//       if (area_min || area_max) {
//         esQuery.body.query.bool.must.push({
//           range: {
//             builtup_area: {
//               gte: area_min || 0,
//               lte: area_max || 999999999,
//             },
//           },
//         });
//       }

//       if (is_public !== undefined) {
//         esQuery.body.query.bool.must.push({
//           term: { is_public: is_public },
//         });
//       }

//       // Sort logic
//       switch (sort) {
//         case 'relevance':
//           esQuery.body.sort.push({ _score: { order: 'desc' } });
//           break;
//         case 'priceAscending':
//           esQuery.body.sort.push({ price: { order: 'asc' } });
//           break;
//         case 'priceDescending':
//           esQuery.body.sort.push({ price: { order: 'desc' } });
//           break;
//         case 'timeAscending':
//           esQuery.body.sort.push({ createdAt: { order: 'asc' } });
//           break;
//         case 'timeDescending':
//           esQuery.body.sort.push({ createdAt: { order: 'desc' } });
//           break;
//         case 'viewsDescending':
//           esQuery.body.sort.push({ views: { order: 'desc' } });
//           break;
//         default:
//           esQuery.body.sort.push({ _score: { order: 'desc' } });
//           break;
//       }

//       // Execute Elasticsearch query
//       const result = await this.elastic.search(esQuery);
      
//       return {
//         results: result.hits.hits.map((hit: any) => hit._source),
//         count: result.hits.total.value,
//       };
//     } catch (error) {
//       console.error('Elasticsearch query failed:', error);
//       throw new Error('Search failed. Please try again later.');
//     }
//   }
// }
export class SearchService {
  private elastic: Client;

  constructor() {
    this.elastic = elastic;
  }

  public async search(params: {
    query?: string;
    property_type?: string;
    bhk?: number;
    user_id?: string;
    preference?: string;
    priceMax?: number;
    priceMin?: number;
    property_id?: string;
    city?: string;
    landmark?: string;
    bathrooms?: number;
    area_min?: number;
    area_max?: number;
    furnished?: boolean;
    parking?: boolean;
    is_public?: boolean;
    is_negotiable?: boolean;
    is_independent?: boolean;
    is_pet_friendly?: boolean;
    security_deposit_max?: number;
    security_deposit_min?: number;
    maintenance_charge_max?: number;
    maintenance_charge_min?: number;
    views_min?: number;
    views_max?: number;
    created_before?: string;
    created_after?: string;
    sort?: string;
    searchRadius?: number;
    lat?: number;
    long?: number;
    page?: number;
    pageSize?: number;
  }) {
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
      searchRadius = 1,
      lat,
      long,
      page = 1,
      pageSize = 30,
    } = params;
    
    

    try {
      // Build base Elasticsearch query
      const esQuery: any = {
        index: 'properties',
        body: {
          query: {
            bool: {
              must: [],
              filter: [],
            },
          },
          sort: [],
          size: pageSize,
          from: (page - 1) * pageSize,
        },
      };

      // Multi-match query for general text search
      if (query) {
        esQuery.body.query.bool.must.push({
          multi_match: {
            query,
            fields: [
              'property_name^3',
              'description^2',
              'Location.address^2',
              'Location.city^2',
              'Location.landmark^3',
            ],
            fuzziness: 'AUTO',
          },
        });
      }

      // Add filters for exact matches
      const exactMatchFields = {
        property_type,
        bhk,
        user_id,
        preference,
        property_id,
        bathrooms,
        furnished,
        parking,
        is_public,
        is_negotiable,
        is_independent,
        is_pet_friendly,
      };

      for (const [field, value] of Object.entries(exactMatchFields)) {
       
        if (value !== undefined ) {
          esQuery.body.query.bool.filter.push({ term: { [field]: value } });
        }
      }

      // Location-based filters
      if (city) {
        esQuery.body.query.bool.filter.push({ term: { 'Location.city': city } });
      }

      if (landmark) {
        esQuery.body.query.bool.must.push({
          match_phrase: { 'Location.landmark': landmark },
        });
      }

      if (searchRadius && lat !== undefined && long !== undefined) {
        esQuery.body.query.bool.filter.push({
          geo_distance: {
            distance: `${searchRadius}m`,
            'Location.coordinates': {
              lat,
              lon: long,
            },
          },
        });
      }

      // Range filters for price, area, and numeric fields
      const rangeFilters = {
        price: { gte: priceMin, lte: priceMax },
        builtup_area: { gte: area_min, lte: area_max },
        security_deposit: { gte: security_deposit_min, lte: security_deposit_max },
        maintenance_charge: { gte: maintenance_charge_min, lte: maintenance_charge_max },
        views: { gte: views_min, lte: views_max },
      };

      for (const [field, range] of Object.entries(rangeFilters)) {
        if (range.gte !== undefined || range.lte !== undefined) {
          esQuery.body.query.bool.filter.push({ range: { [field]: range } });
        }
      }

      // Date range filters
      if (created_before || created_after) {
        esQuery.body.query.bool.filter.push({
          range: {
            createdAt: {
              ...(created_after ? { gte: created_after } : {}),
              ...(created_before ? { lte: created_before } : {}),
            },
          },
        });
      }

      // Sort logic
      const sortOptions: Record<string, any> = {
        relevance: { _score: { order: 'desc' } },
        priceAscending: { price: { order: 'asc' } },
        priceDescending: { price: { order: 'desc' } },
        timeAscending: { createdAt: { order: 'asc' } },
        timeDescending: { createdAt: { order: 'desc' } },
        viewsDescending: { views: { order: 'desc' } },
      };

      esQuery.body.sort.push(sortOptions[sort || 'relevance']);

      // Execute Elasticsearch query
      const result = await this.elastic.search(esQuery);

      // Format response
      return {
        results: result.hits.hits.map((hit: any) => hit._source),
        count: result.hits.total.value,
      };
    } catch (error) {
      console.error('Elasticsearch query failed:', error);
      throw new Error('Search failed. Please try again later.');
    }
  }
}
