import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { DecodedToken } from '../utils/interface';

export const authenticateSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Token not provided');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as DecodedToken;

    socket.data.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};