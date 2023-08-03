"use-strict";
const tokenModel = require("../models/token.model");

class TokenService {
  static create = async ({ userId, publicKey, refreshToken }) => {
    const publicKeyString = publicKey.toString();
    const filter = { user: userId };
    const update = {
      publicKey: publicKeyString,
      refreshTokensUsed: [],
      refreshToken,
    };
    const options = {
      upsert: true,
      new: true,
    };

    const token = await tokenModel.findOneAndUpdate(filter, update, options);

    return token ? token.publicKey : null;
  };

  static update = async ({ userId, publicKey, refreshToken }) => {
    const filter = { user: userId };
    const update = {
      $set: {
        publicKey,
        refreshToken: refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    const token = await tokenModel.findOneAndUpdate(filter, update, options);

    return token ? token.publicKey : null;
  };

  static findById = async (userId) => {
    const result = await tokenModel.findOne({ user: userId });

    return result;
  };

  static removeById = async (id) => {
    const result = await tokenModel.deleteOne({ _id: id });

    return result;
  };

  static removeByUserId = async (id) => {
    const result = await tokenModel.deleteOne({ user: id });

    return result;
  };
}

module.exports = TokenService;
