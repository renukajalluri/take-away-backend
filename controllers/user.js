const User = require("../models/User");
const RestaurantDetails = require("../models/restaurantDetails");
const OwnerDetails = require("../models/OwnerDetails");
const userRouter = require("express").Router();
const { userAuthFilter } = require("../utils/middleware");
const Customer = require("../models/customer");

userRouter.get("/customerUser/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    return res.status(500).json(e);
  }
});

userRouter.get("/customerUser/customer", userAuthFilter, async (req, res) => {
  try {
    console.log("token", req.params.token.id);
    const customer = await Customer.findOne({ _id: req.params.token.id });
    console.log(customer);
    res.status(200).json(customer);
  } catch (err) {
    return res.status(500).json(e);
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(e);
  }
});

userRouter.get("/restaurantDetails", userAuthFilter, async (req, res) => {
  try {
    const restaurant = await RestaurantDetails.findOne({
      owner: req.params.token.id,
    });
    return res.status(200).json(restaurant);
  } catch (e) {
    return res.status(500).json(e);
  }
});
userRouter.get("/restaurantDetails/:ownerId", async (req, res) => {
  try {
    const restaurant = await RestaurantDetails.findOne({
      owner: req.params.ownerId,
    });
    return res.status(200).json(restaurant);
  } catch (e) {
    return res.status(500).json(e);
  }
});
userRouter.post("/restaurantDetails", userAuthFilter, async (req, res) => {
  try {
    console.log(req.body);
    const restaurantDetail = await RestaurantDetails.findOne({
      owner: req.params.token.id,
    });
    if (restaurantDetail) {
      const updatedDetails = await RestaurantDetails.findOneAndUpdate(
        { owner: req.params.token.id },
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedDetails);
    }
    var info = req.body;
    info.owner = req.params.token.id;
    const details = await new RestaurantDetails(info).save();
    console.log(req.params);
    return res.status(200).json(details);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

userRouter.get("/ownerDetails", userAuthFilter, async (req, res) => {
  try {
    const restaurant = await OwnerDetails.findOne({
      owner: req.params.token.id,
    });
    // console.log( req.params.token.id)
    return res.status(200).json(restaurant);
  } catch (e) {
    return res.status(500).json(e);
  }
});

userRouter.post("/ownerDetails", userAuthFilter, async (req, res) => {
  try {
    const ownerDetails = await OwnerDetails.findOne({
      owner: req.params.token.id,
    });
    if (ownerDetails) {
      const updatedOwnerDetails = await OwnerDetails.findOneAndUpdate(
        { owner: req.params.token.id },
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedOwnerDetails);
    }
    var info = req.body;
    info.owner = req.params.token.id;
    const newOwnerDetails = await new OwnerDetails(req.body).save();
    return res.status(200).json(newOwnerDetails);
  } catch (e) {
    return res.status(500).json(e);
  }
});

userRouter.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await RestaurantDetails.find();
    return res.status(200).json(restaurants);
  } catch (e) {
    res.status(500).json(e);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = userRouter;
