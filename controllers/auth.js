const config = require('../utils/config')
const bcrypt = require("bcrypt")
const authRouter = require('express').Router()
const jwt  = require("jsonwebtoken")
const {generateOtp} = require('../utils/generateOpt')
const {sendEmail} = require('../utils/sendmail')
const User = require('../models/user')
const Customer = require('../models/customer')

// <--------Owners------->

authRouter.post('/signUp',async(req,res)=>{
    try{
        const {email , password,name} = req.body
        const userObj = await User.findOne({email:email})
        if(userObj && userObj.verified){
            return res.status(404).json({'msg':'user already exist'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)
        const otp = generateOtp()
        const response = await sendEmail(email,otp)
        console.log(response)
        const newUser = new User({
            name:name,
            email:email,
            password:hashedPassword,
            code : otp

        });
        const user = await newUser.save()
        return res.status(200).json(user)
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/verifyOtp',async(req,res)=>{
    try{
        const {email , otp} = req.body
        const user = await User.findOne({email:email})
        if(user.code == otp){
            const updatedUser = await User.findOneAndUpdate({email:email},{
                $set:{verified : true}
            },{new:true})
            return res.status(200).json(updatedUser)
        }
        return res.status(401).json({'msg':'Wrong otp'})
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/verifyOtpAndLogin',async(req,res)=>{
    try{
        const {email , otp} = req.body
        const user = await User.findOne({email:email})
        if(!user.verified){
            return res.status(404).json({'msg':'user not verified'})
        }
        if(user.code == otp){
            let now = new Date()
            let expires_in = new Date(now.setSeconds( now.getSeconds() + 10))
            const accessToken = jwt.sign({
                id:user._id,
                email:user.email,
                expires_in :expires_in
            },config.SECRET)
            const updtedUser = await User.findOneAndUpdate({email:email},{$set:{otp :""}})
            return res.status(200).json({token : accessToken,
                                        user: user
                                        })
        }   
        return res.status(401).json({'msg':'Wrong otp'})
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/getOtp',async(req,res)=>{
    try{
        const {email } = req.body
        const code = generateOtp()
        const user = await User.findOne({email:email})
        if(user){
            const updatedUser =await User.findOneAndUpdate({email:email},{$set :{code :code}})
            sendEmail(email,code)
            return res.status(200).json({'msg':'otp send sucessfully'})
        }
        return res.status(401).json({'msg':'Email Not Registered'})
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post("/login",async(req,res)=>{
    try {
       const userObj  = await User.findOne({email:req.body.email})
       console.log(userObj)
       if(!userObj) return res.status(401).json({msg :"wrong creditials"});
    //    !userObj && res.status(401).json("wrong creditials");
        if(!userObj.verified) return res.status(400).json({msg : 'User not verified'})
    //    !userObj.verified && res.status(400).json({msg : 'User not verified'})
       
       const validPassword = await bcrypt.compare(req.body.password,userObj.password);
       if(!validPassword) return res.status(400).json({'msg':"Wrong Password"})
    //    !validPassword && res.status(400).json("Wrong Password")
       let now = new Date()
       let expires_in = new Date(now.setSeconds( now.getSeconds() + 10))
       const accessToken = jwt.sign({
           id:userObj._id,
           email: userObj.email,
           expires_in:expires_in
       },config.SECRET)
      return res.status(200).json({userObj,accessToken})
    } catch (error) {
       res.status(500).json({'msg':'something went wrong please try again!'})
       return
    }
 
})

// <--------Customers------->

authRouter.post('/customer/signUp',async(req,res)=>{
    try{
        const {email ,name, password,address} = req.body
        const userObj = await Customer.findOne({email:email})
        if(userObj && userObj.verified){
            return res.status(404).json({'msg':'user already exist'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)
        const otp = generateOtp()
        const response = await sendEmail(email,otp)
        console.log(response)
        const newUser = new Customer({
            name:name,
            address:address,
            email:email,
            password:hashedPassword,
            code : otp

        });
        const user = await newUser.save()
        return res.status(200).json(user)
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/customer/verifyOtp',async(req,res)=>{
    try{
        const {email , otp} = req.body
        const user = await Customer.findOne({email:email})
        console.log(user)
        if(user.code == otp){
            const updatedUser = await Customer.findOneAndUpdate({email:email},{
                $set:{verified : true}
            },{new:true})
            return res.status(200).json(updatedUser)
        }else{
            return res.status(401).json({'msg':'Wrong otp'})
        }
        
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/customer/verifyOtpAndLogin',async(req,res)=>{
    try{
        const {email , otp} = req.body
        const user = await Customer.findOne({email:email})
        if(!user.verified){
            return res.status(404).json({'msg':'user not verified'})
        }
        if(user.code == otp){
            let now = new Date()
            let expires_in = new Date(now.setSeconds( now.getSeconds() + 10))
            const accessToken = jwt.sign({
                id:user._id,
                email:user.email,
                expires_in :expires_in
            },config.SECRET)
            const updtedUser = await Customer.findOneAndUpdate({email:email},{$set:{otp :""}})
            return res.status(200).json({token : accessToken,
                                        user: user
                                        })
        }   
        return res.status(401).json({'msg':'Wrong otp'})
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post('/customer/getOtp',async(req,res)=>{
    try{
        const {email } = req.body
        const code = generateOtp()
        const user = await Customer.findOne({email:email})
        if(user){
            const updatedUser =await Customer.findOneAndUpdate({email:email},{$set :{code :code}})
            sendEmail(email,code)
            return res.status(200).json({'msg':'otp send sucessfully'})
        }
        return res.status(401).json({'msg':'Email Not Registered'})
    }catch(e){
            console.log(e)
            return res.status(500).json({'msg':'something went wrong please try again!'})
        }
    
})

authRouter.post("/customer/login",async(req,res)=>{
    try {
       const userObj  = await Customer.findOne({email:req.body.email})
       if(!userObj) return res.status(401).json({msg :"wrong creditials"});
    //    !userObj && res.status(401).json("wrong creditials");
        if(!userObj.verified) return res.status(400).json({msg : 'User not verified'})
    //    !userObj.verified && res.status(400).json({msg : 'User not verified'})
       
       const validPassword = await bcrypt.compare(req.body.password,userObj.password);
       if(!validPassword) return res.status(400).json({'msg':"Wrong Password"})
    //    !validPassword && res.status(400).json("Wrong Password")
       let now = new Date()
       let expires_in = new Date(now.setSeconds( now.getSeconds() + 10))
       const accessToken = jwt.sign({
           id:userObj._id,
           email: userObj.email,
           expires_in:expires_in
       },config.SECRET)
      return res.status(200).json({userObj,accessToken})
    } catch (error) {
        console.log(error)
       res.status(500).json(error)
       return
    }
 
})


module.exports = authRouter