const express = require("express");
const Router = express.Router();

const OrderController = require("../controllers/Orders");

Router.get("/orders/selectall", OrderController.orders);
Router.put("/orders/completeorder", OrderController.updateOrder);
Router.post("/orders/myorders", OrderController.myOrders);

module.exports = Router;
