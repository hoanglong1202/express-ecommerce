const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronics } = require("../models/product.model");
const { findAllDraftForShop } = require("./repositories/product.repo");

class ProductFactory {
  static productRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];

    if (!productClass) {
      throw new BadRequestError(`Invalid product type: ${type}`);
    }

    return new productClass(payload).createProduct();
  }

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftForShop({ query, limit, skip });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    try {
      const result = await product.create({
        ...this,
        _id: product_id,
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError("Create new clothing error");
    }

    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) {
      throw new BadRequestError("Create new product error");
    }

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Create new electronics error");
    }

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) {
      throw new BadRequestError("Create new product error");
    }

    return newProduct;
  }
}

ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Electronics", Electronics);

module.exports = ProductFactory;
