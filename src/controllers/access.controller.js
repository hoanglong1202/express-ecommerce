const { Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      const result = await AccessService.signUp(req.body);

      return new Created().send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
