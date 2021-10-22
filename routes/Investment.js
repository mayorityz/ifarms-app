const express = require("express");
const controller = require("../controllers/Investment");
const Router = express.Router();

Router.post("/newinvestment", controller.newInvestment);
Router.get("/verify", controller.verification);
Router.get("/myinvestments/:userid", controller.investments);
Router.get("/investment/:id", controller.fetchOne);
Router.get("/fetchallinvestment", controller.fetchAll);

module.exports = Router;
