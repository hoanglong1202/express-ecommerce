const { product } = require("../../models/product.model");
const { Types } = require("mongoose");
const { getUnSelectData, getSelectData } = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
  const regex = new RegExp(keySearch);
  const foundProduct = await product
    .find(
      {
        $text: {
          $search: regex,
        },
        isDraft: false,
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .lean();

  return foundProduct;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: 1 } : { _id: -1 };

  return await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const findProduct = async ({ product_id, unselect }) => {
  return await product.findById(product_id).select(getUnSelectData(unselect)).lean();
};

const updateProduct = async ({ product_id, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(
    {
      _id: product_id,
    },
    payload,
    {
      new: isNew,
    }
  );
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProduct,
};
