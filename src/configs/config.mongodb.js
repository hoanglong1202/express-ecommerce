const development = {
  app: {
    port: process.env.DEV_PORT || 3055,
  },
  database: {
    host: process.env.DEV_DB_HOST || "127.0.0.1",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "ecommerce",
  },
};

const production = {
  app: {
    port: process.env.PRODUCTION_PORT || 3000,
  },
  database: {
    host: process.env.PRODUCTION_DB_HOST || "127.1.1.1",
    port: process.env.PRODUCTION_DB_PORT || 27017,
    name: process.env.PRODUCTION_DB_NAME || "product-ecommerce",
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";
module.exports = config[env];
