const { getUnSelectData, getSelectData, convertToObjectIdMongoDb } = require("../../utils");

const findAllDiscountCodeUnselect = async ({ limit, page, sort, filter, select, model }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: 1 } : { _id: -1 };

  return await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getUnSelectData(select)).lean();
};

const findAllDiscountCode = async ({ limit, page, sort, filter, select, model }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: 1 } : { _id: -1 };

  return await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const findDiscount = async ({ discount_code, discount_shop, model }) => {
  const result = await model
    .findOne({
      discount_shop: convertToObjectIdMongoDb(discount_shop),
      discount_code,
    })
    .lean();
  console.log(result);
  return result;
};

module.exports = {
  findAllDiscountCodeUnselect,
  findAllDiscountCode,
  findDiscount,
};
