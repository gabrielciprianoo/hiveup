import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        response
          .status(409)
          .json({ error: "Ya existe un usuario registrado con ese email" });
        return;
      }

      const user = new User(request.body);
      user.password = await hashPassword(password);

      await user.save();

      response
        .status(201)
        .json({ message: "Cuenta registrada exitosamente revise su email para confirmar su cuenta" });
    } catch (error) {
      response.status(500).json({ error: "Error del servidor" });
    }
  };
}
