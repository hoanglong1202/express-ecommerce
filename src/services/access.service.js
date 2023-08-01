const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenService = require("./token.service");
const { createTokenPair } = require("../utils/auth.utils");
const _ = require("lodash");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRiTER: "WRiTER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Shop already existed");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    const newShop = await shopModel.create({ name, email, password: hashPassword, roles: [RoleShop.SHOP] });
    if (!newShop) {
      throw new ConflictRequestError();
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    const publicKeyString = await tokenService.create({ userId: newShop._id, publicKey });
    if (!publicKeyString) {
      throw new BadRequestError("Public key error");
    }
    const tokens = createTokenPair({ userId: newShop._id, email }, privateKey);

    return {
      code: 201,
      metadata: {
        shop: _.pick(newShop, ["_id", "name", "email"]),
        tokens,
      },
    };
  };
}

module.exports = AccessService;
