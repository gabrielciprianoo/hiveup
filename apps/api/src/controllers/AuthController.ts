import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword, verifyPassword } from "../utils/auth";
import Token from "../models/Token";
import { generate6DigitToken } from "../utils/token";
import { sendConfirmationEmail } from "../services/email";

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

      //create user

      const user = new User(request.body);
      user.password = await hashPassword(password);

      //generate token
      const token = new Token();
      token.token = generate6DigitToken();
      token.user = user.id;

      await Promise.allSettled([user.save(), token.save()]);

      await sendConfirmationEmail({
        to: user.email,
        name: user.name,
        token: token.token,
      });

      response.status(201).json({
        message:
          "Cuenta registrada exitosamente revise su email para confirmar su cuenta",
      });
    } catch (error) {
      response.status(500).json({ error: "Error del servidor" });
    }
  };

  static confirmAccount = async (request: Request, response: Response) => {
    try {
      const { token } = request.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Token no válido");
        response.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);
      if (!user) {
        const error = new Error("Usuario no encontrado");
        response.status(404).json({ error: error.message });
        return;
      }

      user.confirmed = true;
      Promise.allSettled([tokenExist.deleteOne(), user.save()]);

      response.status(201).json({
        message: "Cuenta confirmada exitosamente",
      });
    } catch (error) {
      response.status(500).json({ error: "Error del servidor" });
    }
  };

  static login = async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("Usuario no encontrado");
        response.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {
        const token = new Token();

        token.token = generate6DigitToken();
        token.user = user.id;
        await token.save();

        await sendConfirmationEmail({
          to: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Usuario no esta confirmado. Revisa tu email para confirmar tu cuenta",
        );
        response.status(401).json({ error: error.message });
        return;
      }

      const isCorrectPassword = await verifyPassword(password, user.password);

      if (!isCorrectPassword) {
        const error = new Error("Password incorrecto");
        response.status(401).json({ error: error.message });
        return;
      }

      response.send("autenticado");
    } catch (error) {
      response.status(500).json({ error: "Error del servidor" });
    }
  };
}
