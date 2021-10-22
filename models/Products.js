const DB = require("mongoose");

const productsSchema = new DB.Schema({
  title: String,
  price: Number,
  vendorId: String,
  vendorDetails: Array,
  imgUrls: Array,
  measurement: String,
  category: String,
  description: String,
  quantity: Number,
  reviews: Array,
  uploaded: { type: Date, default: Date.now() },
});

const Product = DB.model("products", productsSchema);

class Products {
  constructor(query) {
    this.p = new Product(query);
    this.allProducts;
  }
  newProduct() {
    this.p.save((err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }

  static displayAll(skip) {
    const query = Product.find({}).skip(skip).limit(8);
    const promise = query.exec();
    return promise
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  static userProducts(query) {
    return Product.find(query);
  }

  static countMyProducts(query) {
    try {
      return Product.countDocuments(query, function (err, count) {
        if (err) {
          return 0;
        }
        if (count) {
          return count;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  static productDetails(query) {
    return Product.find(query);
  }

  static delete(id) {
    return Product.findByIdAndDelete(id);
  }

  /**
   * Edit The User Product'
   * @param {string} id - Product Unique Id
   * @param {string} title - Product Title
   * @param {string} category - Product Category
   * @param {number} price - Product Price
   * @param {string} measurement - Product Measurement/Rates
   * @param {number} quantity - Product Quantity per Measurement
   * @param {string} description - Product Description
   */

  static async edit(
    id,
    title,
    category,
    price,
    measurement,
    quantity,
    description
  ) {
    const filter = { _id: id };
    const update = {
      title,
      category,
      price,
      measurement,
      quantity,
      description,
    };
    try {
      let doc = await Product.findOneAndUpdate(filter, update, { new: true });
      return doc;
    } catch (error) {
      return "error";
    }
  }
}

module.exports = Products;
