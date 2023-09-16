"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inventory_product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inventory_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inventory_stock: {
      type: Number,
      default: true,
      require: true,
    },
    inventory_location: {
      type: String,
      default: 'unknown',
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports ={
  inventory:  model(DOCUMENT_NAME, inventorySchema)
};
