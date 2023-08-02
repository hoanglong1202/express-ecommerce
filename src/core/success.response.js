const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");

class SuccessResponse {
  constructor(message = ReasonPhrases.OK, status = StatusCodes.OK, data = {}) {
    this.message = message;
    this.status = status;
    this.data = message;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor(message = ReasonPhrases.OK, status = StatusCodes.OK, data = {}) {
    super(message, status, data);
  }
}
class Created extends SuccessResponse {
  constructor(message = ReasonPhrases.CREATED, status = StatusCodes.CREATED, data = {}, option = {}) {
    super(message, status, data);
    this.option = option;
  }
}

module.exports = {
  Ok,
  Created,
};
