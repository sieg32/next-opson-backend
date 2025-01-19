
import Property from './properties/property.model';
import ImageProperty from './properties/images.model';
import Location from './properties/location.model';
import User from './users/user.model';
import Like from './likes.model';
import View from './view.model';


export const initializeAssociations = () => {
  Property.hasMany(ImageProperty, {
    foreignKey: 'property_id',
    as: 'images',
  });
  // ImageProperty.belongsTo(Property, {
  //   foreignKey: 'property_id',
  //   as: 'property',
  // });

  Property.hasOne(Location, {
    foreignKey: 'property_id',
    
  });
  Location.belongsTo(Property, {
    foreignKey: 'property_id',
    as: 'property',
  });




User.hasMany(Like, {
  foreignKey: 'user_id',
  // Alias for accessing likes from a user
});

Like.belongsTo(User, {
  foreignKey: 'user_id',
   // Alias for accessing the user from a like
});

// -------------------------------
// Property <-> Like Association
// -------------------------------
Property.hasMany(Like, {
  foreignKey: 'property_id',
   // Alias for accessing likes from a property
});

Like.belongsTo(Property, {
  foreignKey: 'property_id',
   // Alias for accessing the property from a like
});




User.hasMany(View, {
  foreignKey: 'user_id',
   // Alias for accessing views from a user
});

View.belongsTo(User, {
  foreignKey: 'user_id',
   // Alias for accessing the user from a view
});

// -------------------------------
// Property <-> View Association
// -------------------------------
Property.hasMany(View, {
  foreignKey: 'property_id',
   // Alias for accessing views from a property
});

View.belongsTo(Property, {
  foreignKey: 'property_id',
  // Alias for accessing the property from a view
});

};




// Export models
export { Property, ImageProperty, Location };
