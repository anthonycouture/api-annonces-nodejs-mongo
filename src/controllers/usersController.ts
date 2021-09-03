import { NextFunction, Request, Response } from "express";
import { UsersService } from "../services/usersService";
import { UserNotFoundError } from "../errors/userNotFoundError";
import { UserExistError } from "../errors/userExistError";

export class UsersController {
  async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      email,
      password
    } = req.body;
    try {
      const userService = new UsersService();
      res.json({
        token: await userService.authUser(email, password)
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).send();
      } else {
        next(error);
      }
    }
  }

  async register (req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      email,
      password
    } = req.body;
    if (!!email && typeof email === "string" && !!password && typeof password === "string") {
      try {
        const userService = new UsersService();
        res.json({
          token: await userService.registerUser(email, password, "user")
        });
      } catch (error) {
        if (error instanceof UserExistError) {
          res.status(409).send();
        } else {
          next(error);
        }
      }
    } else {
      res.status(400).send();
    }
  }
}
