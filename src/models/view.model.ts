import {
    Table,
    Column,
    Model,
    ForeignKey,
    DataType,
    CreatedAt,
  } from 'sequelize-typescript';
  import User from './users/user.model';
  import Property from './properties/property.model';
  
  @Table({
    tableName: 'views',
    timestamps: false, // Only using CreatedAt for the timestamp
  })
  class View extends Model {
    @ForeignKey(() => User)
    @Column({
      type: DataType.STRING, // Assuming user_id is UUID
      allowNull: false,
    })
    user_id!: string;
  
    @ForeignKey(() => Property)
    @Column({
      type: DataType.STRING, // Assuming property_id is UUID
      allowNull: false,
    })
    property_id!: string;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    viewed_at!: Date; // Automatically tracks when the record is created
  }
  
  export default View;
  