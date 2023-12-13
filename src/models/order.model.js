"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_user_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    /*
      total Price,
      total Applied Discount,
      ship Fee
    */
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
      street
      city
      state
      country
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_product: {
      type: Array,
      default: [],
    },
    order_tracking_number: {
      type: String,
      default: "#000012022000",
    },
    order_status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, orderSchema),
};
