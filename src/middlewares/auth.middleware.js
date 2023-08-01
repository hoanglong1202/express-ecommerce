const { BadRequestError } = require("../core/error.response");
const ApiKeyService = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];

    if (!key) {
      throw new BadRequestError("Require API KEY");
    }

    const objKey = await ApiKeyService.findByKey(key);

    if (!objKey) {
      throw new BadRequestError("Require API KEY");
    }

    req.objKey = objKey;

    return next();
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    const { permissions } = req.objKey;

    if (!permissions) {
      throw new BadRequestError("Require permission");
    }

    const hasPermission = permissions.includes(permission);

    if (!hasPermission) {
      throw new BadRequestError("Require permission");
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
