import { v4 as uuidv4 } from 'uuid';

export function hashPassword(password) {
  // In production, use bcrypt. For MVP, simple encoding
  return Buffer.from(password).toString('base64');
}

export function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

export function generateToken() {
  return uuidv4();
}

export function verifyToken(token, userToken) {
  return token === userToken;
}