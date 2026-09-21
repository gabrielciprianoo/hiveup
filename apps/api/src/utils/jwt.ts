import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type Payload = {
  id: Types.ObjectId;
};
export const generateJWT = (payload: Payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "180d",
  });

  return token;
};
