const OrderModel = require("../models/Orders");
exports.orders = async (req, res) => {
  const orderList = await OrderModel.fetchall();
  if (orderList === "error") res.status(500).send("Database Error!");
  else res.status(200).json(orderList);
};

exports.updateOrder = async (req, res) => {
  const { id } = req.body;
  let x = await OrderModel.updateOrder(
    { _id: id },
    { orderStatus: "Completed" }
  );
  if (x !== null) return res.send("Order Completed");
  else return res.send("Connection Error!");
};

exports.myOrders = async (req, res) =>
  res.send(await OrderModel.myOrders({ customerId: req.body.id }));
