import { body } from "express-validator";

const cleanSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

export const createProjectRules = [
  body("projectName")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("El nombre del proyecto es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("clientName")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("El nombre del cliente es obligatorio")
    .isLength({ min: 3, max: 100 }),

  body("description")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("La descripción es obligatoria")
    .isLength({ min: 10, max: 1000 }),
];
