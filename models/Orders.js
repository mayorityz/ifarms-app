const DB = require("mongoose");

const orderSchema = new DB.Schema({
  customerId: String,
  orderId: String,
  customerDetails: Object,
  order: Array,
  orderDate: Date,
  totalPrice: Number,
  paymentStatus: { type: String, default: "UnPaid" },
  orderStatus: { type: String, default: "InComplete" },
});

const Order = DB.model("Orders", orderSchema);

class CustomerOrders {
  /**
   * Save New Order
   * @param {string} customerId - customer id
   * @param {string} orderId - Order id
   * @param {object} customerDetails - Detailed Desc. of the Customer
   * @param {object} order - cart item
   * @param {number} price - total price
   */
  static async save(customerId, orderId, customerDetails, order, price) {
    const options = {
      customerId: customerId,
      orderId: orderId,
      customerDetails: customerDetails,
      order: order,
      orderDate: Date.now(),
      totalPrice: price,
    };
    try {
      let O = new Order(options);
      return await O.save((response, err) => {
        if (err) return `Order Error ${err}`;
        else return "Order Saved";
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchall() {
    return await Order.find({}, (err, docx) => {
      if (err) return docx;
      else return "error";
    });
  }

  static async updateOrder(options, update) {
    return await Order.findOneAndUpdate(options, update);
  }

  static async countMyPendingOrders(query) {
    try {
      return await Order.countDocuments(query, function (err, count) {
        if (err) {
          return err;
        } else {
          return count;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async myOrders(query) {
    try {
      return await Order.find(query, (err, res) => {
        if (err) {
          return err;
        }
        if (res) {
          return res;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CustomerOrders;
