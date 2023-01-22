const logger = require('./logger')
const config = require('./config')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, request, response, next) => {
    logger.errorLog(error)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({  
        error: 'invalid token'
      })
    }
    logger.error(error.message)
    next(error)
  }

const userAuthFilter =  (request, response, next) => {
    const authorization = request.get('Authorization')
    let token = null;
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }
    if(token){
      console.log(token)
        const decodedToken = jwt.verify(token, config.SECRET)
        if (decodedToken){
            request.params.token = decodedToken
            next()
            return
        }
        else{
          return response.status(403).json({ error: 'Forbidden. Not Authorized for this action' })
        }
    }
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userAuthFilter
  }