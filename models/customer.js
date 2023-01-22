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


var customerSchema = mongoose.Schema({
    name:{
      type: String,
      require: true
    },
    address:[addressSchema],
    email:{
      type: String,
      require: true
    },
    password:{
        type: String,
        require: true
    },
    code:{
        type: String
    },
    verified:{
      type: Boolean,
      default : false
    }
  });

  customerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // the passwordHash should not be revealed
      delete returnedObject.password
      delete returnedObject.code
    }
  })
  
  const Customer = mongoose.model("Customer", customerSchema);
  module.exports = Customer