const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenService = require("./token.service");
const { createTokenPair } = require("../utils/auth.utils");

const RoleShop = {
  SHOP: "SHOP",
  WRiTER: "WRiTER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
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
      console.log(hashPassword)
      const newShop = await shopModel.create({ name, email, password: hashPassword, roles: [RoleShop.SHOP] });

      if (!newShop) {
        return {
          code: 200,
          metadata: null,
        };
      }

      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: { type: "pkcs1", format: "pem" },
        privateKeyEncoding: { type: "pkcs1", format: "pem" },
      });

      const publicKeyString = await tokenService.create({ userId: newShop._id, publicKey });
      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "Public key error",
        };
      }
      const tokens = createTokenPair({ userId: newShop._id, email }, privateKey);

      return {
        code: 201,
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
