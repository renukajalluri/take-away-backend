const mongoose = require('mongoose');

var menuDetailsSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'User'

    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RestaurantDetails'
    },
    name:{
      type: String,
    
    },
    description:{
        type: String,
        
    },
    cost:{
        // type: mongoose.Types.Decimal128,
        // type:Number
        type:Number
        
    },
    image :{
        type: String,
    },
    available :{
        type: Boolean,
        default : true
    }
  });

  
  const MenuDetails = mongoose.model("MenuDetails", menuDetailsSchema);
  module.exports = MenuDetails