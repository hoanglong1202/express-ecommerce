const redisPubsubService = require("../services/redis-pubsub.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    console.log("purchasing::: ", JSON.stringify(order));
    redisPubsubService.publish("purchase_events", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
