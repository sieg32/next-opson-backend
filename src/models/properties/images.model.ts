import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    AllowNull,
  } from 'sequelize-typescript';
  import Property from './property.model';
import { ulid } from 'ulidx';
  
  @Table({
    tableName: 'image_property',
    timestamps: true, // Includes createdAt and updatedAt
  })
  class ImageProperty extends Model {
    @Default(()=>ulid())
    @Column({
      type: DataType.STRING,
      primaryKey: true,
      
    })
    image_id!: string;
  
    @ForeignKey(() => Property)
    @AllowNull(false)
    @Column({
      type: DataType.STRING,
      allowNull: false, // Ensures every image belongs to a property
    })
    property_id!: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    key!: string; // S3 object key
  
    @Column({
      type: DataType.STRING,
      allowNull: false, // URL of the image is required
    })
    url!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true, // Optional alt text for accessibility
    })
    alt_text?: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: 0, // Helps in ordering images
    })
    sort_order?: number;
  
    @BelongsTo(() => Property)
    property!: Property;
  }
  
  export default ImageProperty;
  