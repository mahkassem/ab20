import { sign, verify } from "jsonwebtoken";

const SECRET = "bD7vNyqmY0vd821MM8DM5xqQVDaQdfmw";

function signToken(payload: string) {
  if (SECRET) {
    return sign(payload, SECRET);
  }
}

function verifyToken(token: string) {
  if (SECRET) {
    return verify(token, SECRET);
  }
}

export { signToken, verifyToken };
