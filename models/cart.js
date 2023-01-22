const mongoose = require('mongoose');


var cartSchema = mongoose.Schema({
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RestaurantDetails',
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
    },
    menu:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MenuDetails',
        required:true
     },
     quantity:{
        type:Number,
        // required:true
     },


})


const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart