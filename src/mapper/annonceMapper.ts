import { UsersService } from "../services/usersService";
import { Annonce } from "../entity/annonce";
import { AnnonceDTO } from "../models/annonceDTO";
import { User } from "../entity/user";
import { MapperError } from "../errors/mapperError";

export class AnnonceMapper {
  private readonly _usersService: UsersService;

  constructor () {
    this._usersService = new UsersService();
  }

  async annonceToAnnonceDTO (annonce: Annonce): Promise<AnnonceDTO> {
    const user: User = await this._usersService.getUserById(annonce.meta.idUser);
    if (!annonce._id) {
      throw new MapperError();
    }
    return new AnnonceDTO(annonce._id, annonce.title, annonce.description, user.email);
  }

  async annoncesToAnnoncesDTO (annonces: Annonce[]): Promise<AnnonceDTO[]> {
    const response: AnnonceDTO[] = [];
    for (const annonce of annonces) {
      response.push(await this.annonceToAnnonceDTO(annonce));
    }
    return response;
  }
}
