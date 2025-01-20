import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    ForeignKey,
   
  } from 'sequelize-typescript';
  import { ulid } from 'ulidx';
import User from '../users/user.model';

  
  @Table({
    tableName: 'properties',
    timestamps: true,
    paranoid: true,
  })
  class Property extends Model {
    @PrimaryKey
    @AllowNull(false)
    @Default(() => ulid())
    @Column({
      type: DataType.STRING,
      allowNull: false, 
    })
    property_id!: string;



    @AllowNull(false)
    @ForeignKey(()=>User)
    @Column({
      type: DataType.STRING,
      
    })
    user_id!: string;

    @AllowNull(false)
    @Column({
      type: DataType.STRING,
    })
    property_name!: string;
  
    // Property type (House/Villa, Apartment/Flat, etc.)
    @AllowNull(false)
    @Column({
      type: DataType.ENUM(
        'house/villa',
        'apartment/flat',
        'commercial',
        'plot',
        'land',
        'farmhouse',
        'flatmates',
        'penthouse',
        'builder-floor'
      ),
    })
    property_type!: string;
  
    // Transaction type (Rent, Sale, Lease)
    @AllowNull(false)
    @Column({
      type: DataType.ENUM('rent', 'sale', 'lease'),
    })
    type!: 'rent' | 'sale' | 'lease';
  
    // BHK (1BHK, 2BHK, etc.)
    @AllowNull(true)
    @Column({
      type: DataType.INTEGER,
    })
    bhk?: number;
  



    @AllowNull(true)
    @Column({
      type: DataType.TEXT,
    })
    description?: string;
  
   
  
    @Column({
      type: DataType.INTEGER,
    })
    price?: number;
  
    // Built-up area and Carpet area (in sq. ft.)
    @Column({
      type: DataType.INTEGER,
    })
    builtup_area?: number;
  
    @Column({
      type: DataType.INTEGER,
    })
    carpet_area?: number;
  
    // Sale type (New Projects, Resale Properties)
    @Column({
      type: DataType.ENUM('new', 'resale'),
    })
    sale_type?: 'new' | 'resale';
  
    // Listed by (Owner, Broker, Agent)
    @Column({
      type: DataType.ENUM('owner', 'broker', 'agent'),
    })
    listed_by?: 'owner' | 'broker' | 'agent';
  
    // Bathroom count
    @Column({
      type: DataType.INTEGER,
    })
    bathrooms?: number;
  
    // Age of property
    @Column({
      type: DataType.STRING,
    })
    property_age?: string;
  
    
    @Column({
      type: DataType.ENUM('semi', 'fully', 'non'),
      allowNull:true
    })
    furnished?: string;

    @Column({
      type: DataType.ENUM('boys', 'girls', 'family'),
      allowNull:true
    })
    preference?: string;


    @Column({
      type: DataType.BOOLEAN,
      defaultValue:true
    })
    is_public?: boolean;


    @Column({
      type: DataType.BOOLEAN,
      defaultValue:false
    })
    is_sold?: boolean;

    @Column({
      type: DataType.BOOLEAN,
      allowNull:true,
      defaultValue:false
    })
    parking?: boolean;


    


  
   

    @Default(0)
    @Column({
      type:DataType.INTEGER,
      
    })
    views?:number;

    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    @DeletedAt
    deletedAt?: Date;



   
  }
  
  export default Property;
  