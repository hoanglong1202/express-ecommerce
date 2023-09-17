const _ = require("lodash");
const { Types } = require("mongoose");

const getInformationData = (obj, array = []) => {
  return _.pick(obj, array);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObjectParse = (obj) => {
  const final = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParse(obj[key]);
      Object.keys(response).forEach((sub) => {
        final[`${key}.${sub}`] = response[sub];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

module.exports = {
  getInformationData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParse,
  convertToObjectIdMongoDb,
};
