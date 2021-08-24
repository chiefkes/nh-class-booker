module.exports = class Err extends Error {
  constructor(type, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Err);
    }

    this.name = "CustomError";
    // Custom debugging information
    this.type = type;
  }
};
