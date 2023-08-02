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

  static findById = async (userId) => {
    const result = await tokenModel.findOne({ user: userId }).lean();

    return result;
  };

  static removeById = async (id) => {
    const result = await tokenModel.deleteOne({ _id: id });

    return result;
  };
}

module.exports = TokenService;
