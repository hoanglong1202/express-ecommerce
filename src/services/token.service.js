const tokenModel = require("../models/token.model");

class TokenService {
  static create = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const token = await tokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return token ? token.publicKey : null;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = TokenService;
