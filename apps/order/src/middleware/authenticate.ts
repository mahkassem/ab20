import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/JWS";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  console.log(token);
  if (!token) {
    res.sendStatus(401).send({ message: "JSON Webb Token is missing" });
  } else if (!verifyToken(token)) {
    res.sendStatus(401).send({ message: "JSON Webb Token is invalid" });
  } else {
    next();
  }
}
