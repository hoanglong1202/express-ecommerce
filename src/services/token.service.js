const tokenModel = require("../models/token.model");

class TokenService {
  static create = async ({ userId, publicKey, refreshToken }) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = TokenService;
