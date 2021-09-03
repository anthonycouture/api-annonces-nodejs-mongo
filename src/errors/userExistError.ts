export class UserExistError extends Error {
  constructor (message = "L'utilisateur existe déjà") {
    super(message);
  }
}
