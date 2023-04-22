const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      const result = await AuthService.signUp(req.body);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
