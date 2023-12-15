const redisPubsubService = require("../services/redis-pubsub.service");

class InventoryServiceTest {
  constructor() {
    redisPubsubService.subscribe("purchase_events", (channel, message) => {
      console.log("receive message")
      const order = JSON.parse(message);

      InventoryServiceTest.updateInventory(order.productId, order.quantity);
    });
  }

  static updateInventory(productId, quantity) {
    console.log(`Here is ${productId} have quantity: ${quantity} updated`);
  }
}

module.exports = new InventoryServiceTest();
