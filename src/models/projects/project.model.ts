import { Table, Column, Model, DataType } from 'sequelize-typescript';
import ulid from 'ulidx';

@Table({
  tableName: 'projects',
})
class Projects extends Model {
  @Column({
    type: DataType.STRING(26),
    defaultValue: () => ulid.ulid(), 
    primaryKey: true,
  })
  project_id!: string; // Add the 'id' property here


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: {
      city: '',
      state: '',
      landmark: '',
      address: '',
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
  })
  location?: {
    city: string;
    state: string;
    landmark: string;
    address: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completion_date?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_units?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: {
      min: null,
      max: null,
    },
  })
  price_range?: {
    min: number | null;
    max: number | null;
  };

 

  // Assuming images are stored as an array of URLs

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  rera_id?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  project_property?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  builder_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  builder_description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  builder_logo?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hot_deals_flag!: boolean;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  pr?: number;

  
}

export default Projects;
