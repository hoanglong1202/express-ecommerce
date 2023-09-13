const _ = require("lodash");

const getInformationData = (obj, array = []) => {
  return _.pick(obj, array);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
  getInformationData,
  getSelectData,
  getUnSelectData,
};
