const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronics } = require("../models/product.model");
const { removeUndefinedObject, updateNestedObjectParse } = require("../utils");
const { createInventory } = require("./repositories/inventory.repo");
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProduct,
} = require("./repositories/product.repo");

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

  static async getAllDraftProductForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftForShop({ query, limit, skip });
  }

  static async getAllPublishProductForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };

    return await findAllPublishForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({ limit = 50, page = 1, sort = "ctime", filter = { isPublished: true } }) {
    return await findAllProducts({
      limit,
      page,
      sort,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }

  static async updateProduct({ type, product_id, payload }) {
    const productClass = this.productRegistry[type];

    if (!productClass) {
      throw new BadRequestError(`Invalid product type: ${type}`);
    }

    return new productClass(payload).updateProduct(product_id);
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

      if (result) {
        await createInventory({
          product_id: result._id,
          shop_id: result.product_shop,
          stock: result.product_quantity,
        });
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(product_id) {
    try {
      const result = await updateProduct({
        product_id,
        payload: updateNestedObjectParse(this),
        model: product,
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

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);

    if (payload.product_attributes) {
      await updateProduct({
        product_id,
        payload: updateNestedObjectParse(payload.product_attributes),
        model: clothing,
      });
    }

    const result = await super.updateProduct(product_id);

    return result;
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
