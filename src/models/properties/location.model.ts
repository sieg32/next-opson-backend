import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    AllowNull,
  } from 'sequelize-typescript';
  import Property from './property.model'; // Assuming you have the `Property` model
  
  @Table({
    tableName: 'locations',
    timestamps: true,
  })
  class Location extends Model {
    @ForeignKey(() => Property)
    @AllowNull(false)
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    property_id!: string; // Foreign key to `properties`
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    address!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    city!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    landmark?: string;
  
    @Column({
      type: DataType.GEOGRAPHY('POINT'),
      allowNull: false,
    })
    coordinates!: { type: 'Point'; coordinates: [number, number] }; // [longitude, latitude]
  }
  

  export default Location;