export class UserNotFoundError extends Error {
  constructor (message = "Utilisateur non trouvé") {
    super(message);
  }
}
