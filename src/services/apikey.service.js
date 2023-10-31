const apikeyModel = require("../models/apikey.model");

class ApiKeyService {
  static findByKey = async (key) => {
    const result = await apikeyModel.findOne({ key, status: true }).lean();

    if (!result) {
      const newKey = await apikeyModel.create({ key, permissions: ['0000'] });
      return newKey;
    }

    return result;
  };
}

module.exports = ApiKeyService;
