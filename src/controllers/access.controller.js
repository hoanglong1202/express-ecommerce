const { Created, Ok } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  login = async (req, res, next) => {
    const result = await AccessService.login(req.body);

    new Ok({
      data: result,
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const result = await AccessService.signUp(req.body);

    new Created({
      data: result,
    }).send(res);
  };

  logout = async (req, res, next) => {
    const result = await AccessService.logout(req.keyStore);

    new Ok({
      data: result,
    }).send(res);
  };
}

module.exports = new AccessController();
