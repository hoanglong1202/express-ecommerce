const _ = require("lodash");

const getInformationData = (obj, array = []) => {
  return _.pick(obj, array);
};

module.exports = {
  getInformationData,
};
