import { Sequelize } from "sequelize-typescript";
import config from "./config";
import User from "../models/users/user.model";
import logger from "./logger";
import Projects from "../models/projects/project.model";
import Images  from "../models/projects/Image.model";
import Brochures from "../models/projects/brochure.model";
import PropertyUnit from "../models/projects/propertyUnit.model";
// import { Property, Location, Image as ImageProperties } from "../models";
import Property from '../models/properties/property.model'
import  Location  from "../models/properties/location.model";
import  ImageProperty  from "../models/properties/images.model";
import { initializeAssociations } from "../models/association";
import Like from "../models/likes.model";
import View from "../models/view.model";

// Initialize Sequelize with your database connection details
const sequelize = new Sequelize(config.db.DB_NAME, config.db.USER, config.db.PASSWORD, {
    host: config.db.HOST,
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    models:[User,Property, Location, ImageProperty, Projects,PropertyUnit, Images,  Brochures, Like, View ],
    logging:(msg)=>{logger.info(msg)}
});

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        logger.info("Connection has been established successfully.");
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
    }

})();

initializeAssociations();
export default sequelize;