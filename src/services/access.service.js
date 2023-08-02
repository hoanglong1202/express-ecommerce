const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenService = require("./token.service");
const { createTokenPair } = require("../utils/auth.utils");
const _ = require("lodash");
const { BadRequestError, ConflictRequestError, UnauthorizedError } = require("../core/error.response");
const ShopService = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRiTER: "WRiTER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password }) => {
    const shop = await ShopService.findOne(email);
    if (!shop) {
      throw new BadRequestError("Shop isn't existed");
    }

    const isPasswordLegit = await bcrypt.compare(password, shop.password);

    if (!isPasswordLegit) {
      throw new UnauthorizedError("Authentication Error");
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    const tokens = createTokenPair({ userId: shop._id, email }, privateKey);

    await tokenService.create({
      userId: shop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metadata: {
        shop: _.pick(shop, ["_id", "name", "email"]),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await ShopService.findOne(email);
    if (holderShop) {
      throw new BadRequestError("Shop already existed");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({ name, email, password: hashPassword, roles: [RoleShop.SHOP] });
    if (!newShop) {
      throw new ConflictRequestError();
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    const tokens = createTokenPair({ userId: newShop._id, email }, privateKey);

    await tokenService.create({
      userId: newShop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metadata: {
        shop: _.pick(newShop, ["_id", "name", "email"]),
        tokens,
      },
    };
  };
}

module.exports = AccessService;
