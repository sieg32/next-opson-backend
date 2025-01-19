import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import User from './users/user.model'; // Import your User model
  import Property from './properties/property.model'; // Import your Property model
  
  @Table({
    tableName: 'likes',
    timestamps: true, // Includes createdAt and updatedAt for tracking
  })
  class Like extends Model {
    @ForeignKey(() => User)
    @Column({
      type: DataType.STRING,
      allowNull: false, // User ID is required
    })
    user_id!: string;
  
    @ForeignKey(() => Property)
    @Column({
      type: DataType.STRING,
      allowNull: false, // Property ID is required
    })
    property_id!: string;
  
    @BelongsTo(() => User)
    user!: User;
  
    @BelongsTo(() => Property)
    property!: Property;
  }
  
  export default Like;
  