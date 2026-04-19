import { body } from "express-validator";

const cleanSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

export const registerRules = [
  body("name")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("email")
    .trim()
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("El email no es válido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 8, max: 100 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

export const tokenRules = [
  body("token")
  .notEmpty()
  .isLength({min: 6})
  .withMessage("Token No Válido")
]
