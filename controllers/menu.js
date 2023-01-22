const User = require("../models/User");
const MenuDetails = require("../models/menuDetails");
const RestaurantDetails = require("../models/restaurantDetails");
const menuRouter = require("express").Router();
const { userAuthFilter } = require("../utils/middleware");

menuRouter.get("/", userAuthFilter, async (req, res) => {
  try {
    const items = await MenuDetails.find({ owner: req.params.token.id });
    return res.status(200).json(items);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

menuRouter.get("/:owner", async (req, res) => {
  try {
    const items = await MenuDetails.find({ owner: req.params.owner });
    return res.status(200).json(items);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

menuRouter.post("/", userAuthFilter, async (req, res) => {
  try {
    const restaurant = await RestaurantDetails.findOne({
      owner: req.params.token.id,
    });
    console.log("res", restaurant);
    const item = new MenuDetails(req.body);
    item.owner = req.params.token.id;
    // console.log("res",restaurant)
    item.restaurant = restaurant._id;
    const savedItem = await item.save();
    // console.log(savedItem)
    await RestaurantDetails.findOneAndUpdate(
      { owner: req.params.token.id },
      { $push: { menu: savedItem._id } }
    );
    // console.log("menu",savedItem)

    return res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

menuRouter.put("/:menuId", userAuthFilter, async (req, res) => {
  try {
    const updatedItem = await MenuDetails.findByIdAndUpdate(
      { _id: req.params.menuId },
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

menuRouter.delete("/:menuId", userAuthFilter, async (req, res) => {
  try {
    const deletedItem = await MenuDetails.findByIdAndRemove({
      _id: req.params.menuId,
    });
    return res.status(200).json({ msg: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

menuRouter.get("/:restaurantId", userAuthFilter, async (req, res) => {
  try {
    const menuItems = await MenuDetails.find({
      restaurant: req.params.restaurantId,
    });
    return res.status(200).json(menuItems);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = menuRouter;
