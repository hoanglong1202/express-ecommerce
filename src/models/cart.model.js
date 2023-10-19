"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_product: {
      type: Array,
      require: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
