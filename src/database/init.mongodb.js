"use strict";

const mongoose = require("mongoose");
const { countConnections } = require("../helpers/check.connect");
const { database } = require("../configs/config.mongodb");
const connectionString = `mongodb://${database.host}:${database.port}/${database.name}`;
console.log(connectionString);

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectionString)
      .then(() => {
        console.log("Connect database success");

        const connects = countConnections();
        console.log(`Number of connections::${connects}`);
      })
      .catch((err) => console.log("Connect database failed"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
