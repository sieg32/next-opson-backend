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
        'house',
        'flat',
        'commercial',
        'plot&Land',
        'flatmate',
       
      ),
    })
    property_type!: string;


    
    @Column({
      type: DataType.ENUM(
        'office',
        'retailshop',
        'showroom',
        'warehouse',
        'restaurant',
        'hospital',
        'others'
      ),
      allowNull:true
    })
    project_type!: string;
  
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
      allowNull:true
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


    @Column({
      type: DataType.BOOLEAN,
      
      allowNull:true
    })
    is_negotiable?: boolean;

    @Column({
      type: DataType.BOOLEAN,
      allowNull:true
    })
    is_independent?: boolean;
    
    @Column({
      type: DataType.BOOLEAN,
      allowNull:true
    })
    is_pet_friendly?: boolean;


    @Column({
      type: DataType.INTEGER,
      allowNull:true
    })
    security_deposit?: number;

    @Column({
      type: DataType.INTEGER,
      allowNull:true
    })
    maintenance_charge?: number;

  
    // Built-up area and Carpet area (in sq. ft.)
    @Column({
      type: DataType.INTEGER,
      allowNull:true
    })
    builtup_area?: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull:true
    })
    carpet_area?: number;

    @Column({
      type: DataType.INTEGER,
    })
    area?: number;
  
    // Sale type (New Projects, Resale Properties)
    @Column({
      type: DataType.ENUM('new', 'resale'),
      allowNull:true
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
      allowNull:true
    })
    bathrooms?: number;
  
    // Age of property
    @Column({
      type: DataType.STRING,
      allowNull:true
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


    @Column({
      type: DataType.BOOLEAN,
      allowNull:true,
      defaultValue:false
    })
    boundary_wall?: boolean;

    @Column({
      type: DataType.INTEGER,
      allowNull:true,
      
    })
    cabins?: number;

    @Column({
      type: DataType.JSON,
      allowNull:true,
      
    })
    dimension?: {l:number, b:number};

    @Column({
      type: DataType.INTEGER,
      allowNull:true,
      
    })
    expected_rental?:number;

    @Column({
      type: DataType.INTEGER,
      allowNull:true,
      
    })
    expected_maintenance?:number;

    @Column({
      type: DataType.STRING,
      allowNull:true,
      
    })
    facing?:string;

    @Column({
      type: DataType.STRING,
      allowNull:true,
      
    })
    rera?:string;
    @Column({
      type: DataType.STRING,
      allowNull:true,
      
    })
    plot_side?:string;

    @Column({
      type: DataType.STRING,
      allowNull:true,
      
    })
    ownership?:string;

    @Column({
      type: DataType.STRING,
      allowNull:true,
      
    })
    open_side?:string;

    @Column({
      type: DataType.INTEGER,
      allowNull:true,
      
    })
    ground_to_ceiling?:number;

    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull:true,
      
    })
    amenities?:string[];


    


  
   

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
  