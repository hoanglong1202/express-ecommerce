const shopModel = require("../models/shop.model");

class ShopService {
  static findOne = async (
    email,
    select = {
      name: 1,
      email: 1,
      password: 1,
    }
  ) => {
    const result = await shopModel.findOne({ email }).select(select).lean();

    return result;
  };
}

module.exports = ShopService;
