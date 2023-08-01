const STATUS_CODE = { FORBIDDEN: 403, CONFLICT: 409 };
const REASON_STATUS_CODE = { FORBIDDEN: "Bad Request Error", CONFLICT: "Conflict Error" };

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.CONFLICT, status = STATUS_CODE.CONFLICT) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.FORBIDDEN, status = STATUS_CODE.FORBIDDEN) {
    super(message, status);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
