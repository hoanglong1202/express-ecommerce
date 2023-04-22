class AuthController {
  signUp = async (req, res, next) => {
    try {
      console.log("PPPPPPPPPP");

      return res.status(201).json({
        metadata: "shop PRO",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
