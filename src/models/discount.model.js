"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      type: Number,
      require: true,
    },
    discount_users_count: {
      type: Number,
      require: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_uses_per_uses: {
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },

    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_apply_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_products: {
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
module.exports = model(DOCUMENT_NAME, discountSchema);
