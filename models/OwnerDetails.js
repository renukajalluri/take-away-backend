const mongoose = require('mongoose');

var ownerDetailsSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'User'

    },
    phone:{
      type: String,
    
    },
    full_name:{
        type: String,
        
    }
  });

  
  const OwnerDetails = mongoose.model("OwnerDetails", ownerDetailsSchema);
  module.exports = OwnerDetails