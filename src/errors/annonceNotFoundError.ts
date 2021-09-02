export class AnnonceNotFoundError extends Error {

    constructor(message: string = 'Annonce non trouvé') {
        super(message);
    }
}