const { inventory } = require("../../models/inventory.model");

const createInventory = async ({ product_id, shop_id, stock = 1, location = "unknown" }) => {
  return await inventory.create({
    inventory_product: product_id,
    inventory_shop: shop_id,
    inventory_stock: stock,
    inventory_location: location,
  });
};

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
  const query = {
    inventory_product: product_id,
    inventory_stock: {
      $gte: quantity,
    },
  };
  const updateSet = {
    $inc: {
      inventory_stock: -quantity,
    },
    $push: {
      inventory_reservations: {
        quantity,
        cart_id,
        created_on: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };

  return inventory.updateOne(query, updateSet, options);
};

module.exports = {
  createInventory,
  reservationInventory,
};
