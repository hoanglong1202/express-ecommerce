"use-strict";
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler.helpers");
const ApiKeyService = require("../services/apikey.service");
const TokenService = require("../services/token.service");
const jwt = require("jsonwebtoken");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
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

const authentication = asyncHandler(async (req, res, next) => {
  const clientId = req.headers[HEADER.CLIENT_ID];
  if (!clientId) {
    throw new UnauthorizedError("Invalid request");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid request");
  }

  const keyStore = await TokenService.findById(clientId);
  if (!keyStore) {
    throw new NotFoundError("Invalid request");
  }

  try {
    const { userId } = jwt.verify(accessToken, keyStore.publicKey);
    if (clientId !== userId) {
      throw new UnauthorizedError("Invalid request");
    }

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    next(error);
  }
});

module.exports = {
  apiKey,
  permission,
  authentication,
};
