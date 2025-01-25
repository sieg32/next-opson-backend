// Import Elasticsearch elastic
import elastic from '../../config/elastic'
import  { Property, Location, ImageProperty } from '../../models'; // Adjust the import to your models structure



// ElasticInitialize Service
export class ElasticInitialize {
    private indexName;
    constructor() {
        this.indexName = 'properties';
    }

    async createIndex() {
        console.log('index creation start')
        const indexExists = await elastic.indices.exists({ index: this.indexName });

        if (!indexExists) {
            await elastic.indices.create({
                index: this.indexName,
                body: {
                    mappings: {
                        properties: {
                            property_id: { type: 'keyword' },
                            user_id: { type: 'keyword' },
                            property_name: { type: 'text' },
                            property_type: { type: 'keyword' },
                            project_type: { type: 'keyword' },
                            type: { type: 'keyword' },
                            bhk: { type: 'integer' },
                            description: { type: 'text' },
                            price: { type: 'double' },
                            builtup_area: { type: 'integer' },
                            carpet_area: { type: 'integer' },
                            area: { type: 'integer' },
                            sale_type: { type: 'keyword' },
                            listed_by: { type: 'keyword' },
                            bathrooms: { type: 'integer' },
                            property_age: { type: 'text' },
                            furnished: { type: 'keyword' },
                            preference: { type: 'keyword' },
                            is_public: { type: 'boolean' },
                            is_sold: { type: 'boolean' },
                            is_negotiable: { type: 'boolean' },
                            is_independent: { type: 'boolean' },
                            is_pet_friendly: { type: 'boolean' },
                            security_deposit:{ type: 'integer' },
                            maintenance_charge:{ type: 'integer' },
                            parking: { type: 'boolean' },
                            boundary_wall: { type: 'boolean' },
                            cabins: { type: 'integer' },
                            dimension: { properties: {
                                l:{type:'integer'},
                                b:{type:'integer'},
                                
                            } },

                            expected_rental: { type: 'integer' },
                            expected_maintenance: { type: 'integer' },
                            facing: { type: 'text' },
                            rera: { type: 'text' },
                            plot_side: { type: 'text' },
                            ownership: { type: 'text' },
                            open_side: { type: 'text' },
                            views: { type: 'integer' },
                            createdAt: { type: 'date' },
                            updatedAt: { type: 'date' },
                            deletedAt: { type: 'date' },
                            Location: {
                                properties: {
                                    id: { type: 'integer' },
                                    property_id: { type: 'keyword' },
                                    address: { type: 'text' },
                                    city: { type: 'keyword' },
                                    landmark: { type: 'text' },
                                    coordinates: {
                                        type: 'geo_point'
                                    },
                                    createdAt: { type: 'date' },
                                    updatedAt: { type: 'date' }
                                }
                            },
                            images: {
                                type: 'nested',
                                properties: {
                                    image_id: { type: 'keyword' },
                                    property_id: { type: 'keyword' },
                                    key: { type: 'text' },
                                    url: { type: 'text' },
                                    alt_text: { type: 'text' },
                                    sort_order: { type: 'integer' },
                                    createdAt: { type: 'date' },
                                    updatedAt: { type: 'date' }
                                }
                            }
                        }
                    }
                }
            });

            console.log(`Index "${this.indexName}" created successfully.-----------------------------------------------------------------------------------------------------------------`);
        } else {
            console.log(`Index "${this.indexName}" already exists.-----------------------------------------`);
        }
    }

    async addAllProperties() {
        try {
            console.log('property addiotion start ')
            const data = await Property.findAll({
                include: [
                    Location,
                    { model: ImageProperty, as: 'images' }
                ]
            });

            
            const bulkData = data.map((property) => {
                return [
                    { index: { _index: this.indexName, _id: property.property_id } },
                    {
                        property_id: property.property_id,
                        user_id: property.user_id,
                        property_name: property.property_name,
                        property_type: property.property_type,
                        type: property.type,
                        bhk: property.bhk,
                        description: property.description,
                        price: property.price,
                        builtup_area: property.builtup_area,
                        carpet_area: property.carpet_area,
                        sale_type: property.sale_type,
                        listed_by: property.listed_by,
                        bathrooms: property.bathrooms,
                        property_age: property.property_age,
                        furnished: property.furnished,
                        preference: property.preference,
                        is_public: property.is_public,
                        is_sold: property.is_sold,
                        parking: property.parking,
                        boundary_wall:property.boundary_wall,
                        cabins:property.cabins,
                        dimension:property.dimension,
                        expected_rental:property.expected_rental,
                        expected_maintenance:property.expected_maintenance,
                        facing:property.facing,
                        rera:property.rera,
                        plot_side:property.plot_side,
                        open_side:property.open_side,
                        ownership:property.ownership,
                        area:property.area,
                        is_negotiable:property.is_negotiable,
                        is_independent:property.is_independent,
                        is_pet_friendly:property.is_pet_friendly,
                        security_deposit:property.security_deposit,
                        maintenance_charge:property.maintenance_charge,
                        views: property.views,
                        createdAt: property.createdAt,
                        updatedAt: property.updatedAt,
                        deletedAt: property.deletedAt,
                        Location: property.Location ? {
                            id: property.Location.id,
                            property_id: property.Location.property_id,
                            address: property.Location.address,
                            city: property.Location.city,
                            landmark: property.Location.landmark,
                            coordinates: property.Location.coordinates ? {
                                lat: property.Location.coordinates.coordinates[1],
                                lon: property.Location.coordinates.coordinates[0]
                            } : null,
                            createdAt: property.Location.createdAt,
                            updatedAt: property.Location.updatedAt
                        } : null,
                        images: property.images ? property.images.map(image => ({
                            image_id: image.image_id,
                            property_id: image.property_id,
                            key: image.key,
                            url: image.url,
                            alt_text: image.alt_text,
                            sort_order: image.sort_order,
                            createdAt: image.createdAt,
                            updatedAt: image.updatedAt
                        })) : []
                    }
                ];
            }).flat();

            
            if (bulkData.length > 0) {
                await elastic.bulk({
                    refresh: true,
                    body: bulkData
                });

                console.log("All properties have been added to Elasticsearch.");
            }
        } catch (error) {
            console.error("Error adding properties to Elasticsearch:", error);
        }
    }
}



