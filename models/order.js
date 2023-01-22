const mongoose = require('mongoose');
var addressSchema = mongoose.Schema({
    phone:{
      type: String,
      require: true
    },
    street:{
      type: String,
      require: true
    },
    doorNum:{
      type: String,
      require: true
    },
    postCode:{
      type: String,
      require: true
    },
    city:{
      type: String,
      require: true
    },
  })
  

var orderSchema = mongoose.Schema({
  restaurant :{
    type:mongoose.Schema.Types.ObjectID,
    ref :'RestaurantDetails'
  },
    owner:{
        type:mongoose.Schema.Types.ObjectID,
        ref :'User'
    },
    customer:{
      type:mongoose.Schema.Types.ObjectID,
      ref :'Customer'
  },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MenuDetails'
    },
    quantity :{
      type:Number,
    },
   time:{
    type:Number,
  
   },
   address:addressSchema,
   status:{
    type:String,
    default:'processing'
   },
   customerOrder :{
    type:mongoose.Schema.Types.ObjectId
   }


})


const Order = mongoose.model("Order", orderSchema);
module.exports = Order