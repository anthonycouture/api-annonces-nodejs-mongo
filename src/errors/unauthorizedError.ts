export class UnauthorizedError extends Error {
  constructor (message = "Non autorisé") {
    super(message);
  }
}
