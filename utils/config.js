require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URL=process.env.MONGODB_URI
let SECRET=process.env.SECRET

module.exports = {
    PORT,
    SECRET,
    MONGODB_URL
  }
  