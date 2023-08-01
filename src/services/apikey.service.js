const apikeyModel = require("../models/apikey.model");

class ApiKeyService {
  static findByKey = async (key) => {
    const result = await apikeyModel.findOne({ key, status: true }).lean();

    return result;
  };
}

module.exports = ApiKeyService;
