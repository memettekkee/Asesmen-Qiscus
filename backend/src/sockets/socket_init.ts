import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticateSocket } from './socket_auth';
import { socketHandlers } from './handler/handlers';

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socketHandlers(io, socket); 
  });

  return io;
};