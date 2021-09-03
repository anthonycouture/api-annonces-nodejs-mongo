export class MapperError extends Error {

    constructor(message: string = `Problème avec les champs de l'entré`) {
        super(message);
    }
}