const cartModel = require("../../models/cart.model");
const { convertToObjectIdMongoDb } = require("../../utils");

const findCartById = async (cartId) => {
  return await cartModel.findOne({ _id: convertToObjectIdMongoDb(cartId), cart_state: "active" }).lean();
};

module.exports = {
  findCartById,
};
