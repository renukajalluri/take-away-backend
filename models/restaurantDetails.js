const mongoose = require('mongoose');

var restaurantDetailsSchema = mongoose.Schema({
    owner:{
      type:mongoose.Schema.Types.ObjectID,
      ref :'User'
      
    },
    order:[{
      type : mongoose.Schema.Types.ObjectId,
      ref:"Order"
    }],
    menu:[
      {
        type : mongoose.Schema.Types.ObjectId,
        ref:"MenuDetails"
    }
    ],
    name:{
      type: String,
      
    
    },
    phone:{
        type: String,
      
    },
    address:{
        type: String,
       
    },
    location:{
      type: String,
      
    },
    closing_time:{
      type: String,
     
    },
    opening_time:{
      type: String,
     
    },
    banners:[
      {type: String},
      ],
    
  });


  
  const RestaurantDetails = mongoose.model("RestaurantDetails", restaurantDetailsSchema);
  module.exports = RestaurantDetails