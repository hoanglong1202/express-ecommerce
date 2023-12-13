"use-strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("./repositories/inventory.repo");

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const delAsyncKey = promisify(redisClient.del).bind(redisClient);

const acquireLock = async ({ product_id, quantity, cart_id }) => {
  const key = `lock_v2023_${product_id}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let index = 0; index < retryTime; index++) {
    const result = setnxAsync(key, expireTime);
    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        product_id,
        quantity,
        cart_id,
      });

      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, expireTime));
  }
};

const releaseLock = async (keyLock) => {
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
