 import { Socket } from 'socket.io';
 
 export interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }
  
export interface SocketWithUser extends Socket {
  data: {
    user?: {
      id: string;
      email: string;
    };
  };
}