const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const { createTokenPair, generatedToken } = require("../utils/auth.utils");

const { BadRequestError, ConflictRequestError, UnauthorizedError } = require("../core/error.response");
const ShopService = require("./shop.service");
const { getInformationData } = require("../utils");
const TokenService = require("./token.service");

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

    const { privateKey, publicKey } = generatedToken();
    const tokens = createTokenPair({ userId: shop._id, email }, privateKey);

    await tokenService.create({
      userId: shop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInformationData(shop, ["_id", "name", "email"]),
      tokens,
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

    const { privateKey, publicKey } = generatedToken();
    const tokens = createTokenPair({ userId: newShop._id, email }, privateKey);

    await tokenService.create({
      userId: newShop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInformationData(newShop, ["_id", "name", "email"]),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const result = await TokenService.removeById(keyStore._id);

    return result;
  };

  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { email } = user;
    const { refreshTokensUsed } = keyStore;

    if (refreshTokensUsed.includes(refreshToken)) {
      throw new BadRequestError("Something wrong, please re-login");
    }

    const shop = await ShopService.findOne(email);
    if (!shop) {
      throw new ConflictRequestError();
    }

    const { privateKey, publicKey } = generatedToken();
    const tokens = createTokenPair({ userId: shop._id, email }, privateKey);

    // update key store
    await tokenService.update({
      userId: shop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInformationData(shop, ["_id", "name", "email"]),
      tokens,
    };
  };
}

module.exports = AccessService;
