"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongoDb } = require("../utils");
const discount = require("./discount.service");
const { findAllDiscountCodeUnselect } = require("./repositories/discount.repo");

class DiscountService {
  static async createDiscount({
    discount_name,
    discount_description,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_users_count,
    discount_users_used,
    discount_max_uses_per_uses,
    discount_min_order_value,
    discount_shop,
    discount_is_active,
    discount_apply_to,
    discount_products,
  }) {
    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new BadRequestError("Invalid Date Range");
    }

    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Invalid Date Range");
    }

    const foundDiscount = await discount
      .findOne({
        discount_shop: convertToObjectIdMongoDb(discount_shop),
        discount_code,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount not valid");
    }

    const result = await discount.create({
      discount_name,
      discount_description,
      discount_value,
      discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_users_count,
      discount_users_used,
      discount_max_uses_per_uses,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shop,
      discount_is_active,
      discount_apply_to,
      discount_products: discount_apply_to === "all" ? [] : discount_products,
    });

    return result;
  }

  // async updateDiscount() {}

  static async getAllDiscountCodeWithProduct({ discount_code, discount_shop, limit, page }) {
    const foundDiscount = await discount
      .findOne({
        discount_shop: convertToObjectIdMongoDb(discount_shop),
        discount_code,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist");
    }

    const query = {
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name", "_id"],
    };

    if (foundDiscount.discount_apply_to === "all") {
      query.filter = {
        product_shop: convertToObjectIdMongoDb(discount_shop),
        isPublished: true,
      };
    }

    if (foundDiscount.discount_apply_to === "specific") {
      query.filter = {
        _id: { $in: foundDiscount.discount_products },
        isPublished: true,
      };
    }

    const result = await findAllProducts(query);

    return result;
  }

  static async getAllDiscountByShop({ discount_shop, limit, page }) {
    const query = {
      filter: {
        discount_shop: convertToObjectIdMongoDb(discount_shop),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      unselect: ["__v"],
      model: discount,
    };

    const result = await findAllDiscountCodeUnselect(query);

    return result;
  }
}

module.exports = DiscountService;
