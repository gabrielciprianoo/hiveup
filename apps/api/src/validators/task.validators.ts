import { body } from "express-validator";

const cleanSpaces = (v: string) => v.replace(/\s+/g, " ").trim();

export const createTaskRules = [
  body("name")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("El nombre de tarea es obligatorio")
    .isLength({ min: 4, max: 50 })
    .withMessage("El nombre debe tener entre 4 y 50 caracteres"),

  body("description")
    .trim()
    .customSanitizer(cleanSpaces)
    .notEmpty().withMessage("La descripción es obligatoria")
    .isLength({ min: 10, max: 1000 }),
];
