export class MapperError extends Error {
  constructor (message = "Problème avec les champs de l'entré") {
    super(message);
  }
}
