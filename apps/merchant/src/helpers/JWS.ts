import { sign, verify } from "jsonwebtoken";

const SECRET = "bD7vNyqmY0vd821MM8DM5xqQVDaQdfmw";

function signToken(payload: string) {
  return sign(payload, SECRET);
}

function verifyToken(token: string) {
  return verify(token, SECRET);
}

export { signToken, verifyToken };
