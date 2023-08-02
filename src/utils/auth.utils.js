"use strict";
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createTokenPair = (payload, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  return { accessToken, refreshToken };
};

const generatedToken = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
};

module.exports = {
  createTokenPair,
  generatedToken,
};
