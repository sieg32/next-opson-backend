import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import ulid from 'ulidx';
  import Project from './project.model'; // Assuming Project model is in the same directory
  import PropertyUnit from './propertyUnit.model'; // Assuming PropertyUnit model is in the same directory
  
  @Table({
    tableName: 'brochures',
  })
  class Brochures extends Model {
    @Column({
      type: DataType.STRING(26),
      defaultValue: () => ulid.ulid(), // Generates a ULID dynamically
      primaryKey: true,
      allowNull: false,
    })
    brochure_id!: string;
  
    // Foreign key to the Project table
    @ForeignKey(() => Project)
    @Column({
      type: DataType.STRING(26),
      allowNull: false,
    })
    project_id!: string;
  
    @BelongsTo(() => Project)
    project!: Project;
  
    
  
   
  
    // File name of the image
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    file_name!: string;
  
    // AWS S3 image link
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    brochure_url!: string;
  }
  
  export default Brochures;
  