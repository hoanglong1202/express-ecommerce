const { inventory } = require("../../models/inventory.model");

const createInventory = async ({ product_id, shop_id, stock = 1, location = "unknown" }) => {
  return await inventory.create({
    inventory_product: product_id,
    inventory_shop: shop_id,
    inventory_stock: stock,
    inventory_location: location,
  });
};

module.exports = {
  createInventory,
};
