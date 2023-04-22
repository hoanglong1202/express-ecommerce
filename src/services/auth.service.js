const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const RoleShop = {
  SHOP: "SHOP",
  WRiTER: "WRiTER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already exist",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({ name, email, password: hashPassword, roles: [RoleShop.SHOP] });

      if (newShop) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 4096 });
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      };
    }
  };
}

module.exports = AuthService;
