export class AnnonceNotFoundError extends Error {
  constructor (message = "Annonce non trouvé") {
    super(message);
  }
}
