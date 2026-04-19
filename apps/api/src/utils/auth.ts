import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  passwordEntered: string,
  passwordStored: string,
) => {
  return bcrypt.compare(passwordEntered, passwordStored);
};
