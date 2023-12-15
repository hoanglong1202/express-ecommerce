"use-strict";

const redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async subscribe(channel, callback) {
    // Subscribe to the specified channel
    await this.subscriber.subscribe(channel);

    this.subscriber.on("message", (subChannel, message) => {
      if (channel === subChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
