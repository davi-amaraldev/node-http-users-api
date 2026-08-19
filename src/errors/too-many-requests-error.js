export class TooManyRequestsError extends Error {
  constructor(retryAfter) {
    super("Too many requests");

    this.name = "TooManyRequestsError";
    this.retryAfter = retryAfter;
  }
}