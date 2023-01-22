const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name:{
      type: String,
      require: true
    },
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

  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // the passwordHash should not be revealed
      delete returnedObject.password
      delete returnedObject.code
    }
  })
  
  const User = mongoose.model("User", userSchema);
  module.exports = User