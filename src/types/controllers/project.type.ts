export type Coordinates = {
    latitude: number | null;
    longitude: number | null;
  };
  
 export type Location = {
    city: string;
    state: string;
    landmark: string;
    address: string;
    coordinates: Coordinates;
  };
  
 export type PriceRange = {
    min: number | null;
    max: number | null;
  };
  
 export type ProjectDataText = {
    name: string;
    description?: string;
    status?: string;
    location?: Location;
    start_date?: Date;
    completion_date?: Date;
    total_units?: number;
    price_range?: PriceRange;
    rera_id?: string;
    
  };
  

export type ProjectUpdateData = {
  name?: string;
  description?: string;
  status?: string;
  location?: object;
  start_date?: Date;
  completion_date?: Date;
  total_units?: number;
  price_range?: object;
  rera_id?: string;
}