const { Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      const result = await AccessService.signUp(req.body);
      new Created({
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
