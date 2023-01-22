const Order = require("../models/order")
const orderRouter = require("express").Router()
const { userAuthFilter } = require("../utils/middleware")
const RestaurantDetails = require("../models/restaurantDetails")
const Cart = require('../models/cart') 
const MenuDetails = require("../models/menuDetails")
const Customer = require('../models/customer')
const CustomerOrder = require('../models/customerOrder')
const {deliveryEmail} = require('../utils/deliveryEmail')
const { populate } = require("../models/order")

const saveOrder =async (address, item,time,orderList,customerOrderId,values)=>{
    try{
        console.log('values',values[item.menu.restaurant])
        const order = new Order({
            restaurant:item.menu.restaurant,
            owner : item.menu.owner ,
            customer:item.user,
            item : item.menu._id,
            quantity : item.quantity,
            address:address,
            time : values[item.menu.restaurant],
            customerOrder : customerOrderId
        })
        orderList.push(order._id)
        const savedOrder = await order.save()

        const det = await Cart.findByIdAndRemove({_id : item._id})
        // console.log('deleted',det)
        return orderList
    }
    catch(e){
        console.log(e)
        return(e)
    }
}

orderRouter.post("/",userAuthFilter,async(req,res)=>{
        
    try {
        const list = req.body.carts
        var orderList = []
        var customerOrder = new CustomerOrder({
            customer : req.params.token.id
        })
        var customerOrderId = customerOrder._id
        const {city , door,phone,postCode, street} = req.body.address
        var address ={
            city :city,
            door : door,
            phone : phone,
            postCode : postCode,
            street :street
        }
        list.map(item=>{
            // console.log(item)
           saveOrder(address,item,req.body.time,orderList,customerOrderId,req.body.address)
        //    console.log('res',orderList)
        })
        customerOrder.orders = orderList
        const savedOrder = await customerOrder.save()
        return res.status(200).json({msg : 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

orderRouter.get("/cancel/:id",userAuthFilter,async(req,res)=>{
    try {
        console.log(req.params.id)
        const customerOrder = await CustomerOrder.findByIdAndUpdate(req.params.id,{
            $set : { cancelled : true }
        },{new : true})
        const orders =await Order.updateMany({customerOrder : req.params.id},{
            $set : { status : 'cancelled' }
        },{ new : true})
        console.log(orders)
        return res.status(200).json({msg : 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
// orderRouter.get("/customerCarts",userAuthFilter,async(req,res)=>{
//     try {
//         console.log('tok',req.params.token)
//         const orders = await Cart.find({user:req.params.token.id}).populate({
//             path : 'menu'
//             // populate :{path : 'restaurant'}
//         }).populate({
//             path :'restaurant',
           
//         }).exec()
//         console.log(orders)
//         return res.status(200).json(orders)
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// })
orderRouter.get("/customerOrders",userAuthFilter,async(req,res)=>{
    try {
        // console.log('tok',req.params.token)
        const orders = await CustomerOrder.find({customer:req.params.token.id}).sort({_id :-1}).populate({
            path : 'orders',
            populate :{path: 'restaurant'}
        }).populate({
            path : 'orders',
            populate : {path : 'item'}
        }).exec()
        console.log(orders)
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
orderRouter.get("/owners/:status",userAuthFilter,async(req,res)=>{
    try {
        const orders = await Order.find({owner:req.params.token.id, status : req.params.status}).populate({
            path : 'item',
            // populate :{path : 'restaurant'}
        }).populate({
            path :'customer'
        }).exec()
        console.log(orders)
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
orderRouter.get("/accept/:status/:order",userAuthFilter,async(req,res)=>{
    console.log(req.params.status,req.params.customer)
    try{
        const orders = await Order.updateMany({owner:req.params.token.id, status : req.params.status,customerOrder:req.params.order},{
            $set:{status:'accepted'}
        },{new:true})
        console.log(orders)
        return res.status(200).json(orders)
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }

})
orderRouter.get("/complete/:status/:order",userAuthFilter,async(req,res)=>{
    console.log(req.params.status,req.params.customer)
    try{
        const orders = await Order.updateMany({owner:req.params.token.id, status : req.params.status,customerOrder:req.params.order},{
            $set:{status:'completed'}
        },{new:true})
        console.log(orders)
        const uorder =await  CustomerOrder.findByIdAndUpdate( req.params.order,{
            $set:{completed:true}
        })
        const order =await  CustomerOrder.findById( req.params.order).populate('customer').exec()
        deliveryEmail(order.customer.email)
        return res.status(200).json(orders)
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }

})
orderRouter.get("/decline/:status/:order",userAuthFilter,async(req,res)=>{
    // console.log(req.params.status,req.params.customer)
    try{
        const orders = await Order.updateMany({owner:req.params.token.id, status : req.params.status,customerOrder:req.params.order},{
            $set:{status:'cancelled'}
        },{new:true})
        console.log(orders)
        return res.status(200).json(orders)
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }

})
// orderRouter.get("/:restaurantId",userAuthFilter,async(req,res)=>{
//     try {
//         const orders = await Order.find({restaurant:req.params.restaurantId})
//         return res.status(200).json(orders)
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })

orderRouter.post('/cart',userAuthFilter,async(req,res)=>{
    try{
        // console.log(req.body)
        const cart = await  Cart.findOne({menu:req.body.menu, user:req.params.token.id})
        
        if(cart){

            const updatedCart = await Cart.findOneAndUpdate({_id:cart._id},{
                quantity:req.body.quantity
            },{new:true})
            
            return res.status(200).json(updatedCart)
        }
        const newCart = new Cart(req.body)
        newCart.user = req.params.token.id
        savedCart =  await newCart.save()
        // console.log('sa',savedCart)
        return res.status(200).json(savedCart)

    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
})

orderRouter.get('/carts/items',userAuthFilter,async(req,res)=>{
    // console.log('res')
    try{
        // console.log(req.params.token)
        const cart = await  Cart.find({user:req.params.token.id,quantity:{$gt:0}}).populate('menu').populate('restaurant')
        // console.log(cart)
        return res.status(200).json(cart)

    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
})

orderRouter.get('/cart/:id',userAuthFilter,async(req,res)=>{
    try{
        // console.log(req.params.id)
        const cart = await  Cart.findOne({menu:req.params.id,user:req.params.token.id})
        console.log(req.params.id,cart)
        return res.status(200).json(cart)

    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
})

orderRouter.get('/increase/:id',userAuthFilter,async(req,res)=>{
    try{
        // console.log(req.params.id)
        const cart = await  Cart.findOneAndUpdate({menu:req.params.id,user:req.params.token.id},{
            $inc:{quantity : 1}
        },{new : true})
        
        return res.status(200).json(cart)

    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
})

orderRouter.get('/decrease/:id',userAuthFilter,async(req,res)=>{
    try{
        // console.log(req.params.id)
        const cart = await  Cart.findOneAndUpdate({menu:req.params.id,user:req.params.token.id},{
            $inc:{quantity : -1}
        },{new : true})
        
        return res.status(200).json(cart)

    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
})
module.exports = orderRouter