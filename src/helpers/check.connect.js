const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const SECONDS = 5000;

const countConnections = () => {
  const connects = mongoose.connections.length;

  return connects;
};

const checkOverload = () => {
  setInterval(() => {
    const connects = countConnections();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnection = numCores * 5;

    console.log(`Active connections:: ${connects}`);
    console.log(`Memory Usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (connects > maxConnection) {
      console.log(`Connection overloaded!!!!`);
    }
  }, SECONDS);
};

module.exports = {
  countConnections,
  checkOverload,
};
