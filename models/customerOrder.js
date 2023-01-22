const mongoose = require('mongoose');


var customerOrderSchema = mongoose.Schema({
    customer: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Customer"
        
    },
    orders:[
        {type : mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }
    ],
    cancelled:{
        type:Boolean,
        default: false
    },
    completed:{
        type:Boolean,
        default: false
    },
    
})


const CustomerOrder = mongoose.model("CustomerOrder", customerOrderSchema);
module.exports = CustomerOrder