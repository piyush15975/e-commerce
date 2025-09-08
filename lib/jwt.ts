import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
};