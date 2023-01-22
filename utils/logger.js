const info = (...params) => {
    console.log(...params)
}
  
const error = (...params) => {
    console.error(...params)
}

const errorLog = (error) => {
    try{
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      }
      else{
        console.error(error)
      }
    }
    catch (e) {
        console.log("serious Error should not happen in errorLog", e)
    }
}
  
  module.exports = {
    info, error, errorLog
  }