import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { messageHandler } from './msgHandler';

export const connectedUsers: Array<{userId: string, socketId: string}> = [];

export const socketHandlers = (io: SocketIOServer, socket: SocketWithUser) => {

    if (socket.data.user) {
        connectedUsers.push({
            userId: socket.data.user.id,
            socketId: socket.id
        });
        
        console.log(`User ${socket.data.user.id} connected with socket ${socket.id}`);
    }

    messageHandler(io, socket);

    // General events
    socket.onAny((event, ...args) => {
        console.log(`Received event: ${event}`, args);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Remove from connected users
        const index = connectedUsers.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
            const userId = connectedUsers[index].userId;
            connectedUsers.splice(index, 1);
            
            // Broadcast offline status
            io.emit('user_status_changed', {
                userId,
                status: 'offline',
                timestamp: new Date()
            });
            
            console.log(`User ${userId} disconnected and removed from tracking`);
        }
    });


};

export const getUserSocketId = (userId: string): string | undefined => {
    const user = connectedUsers.find(user => user.userId === userId);
    return user?.socketId;
};

export const getUserIdFromSocketId = (socketId: string): string | undefined => {
    const user = connectedUsers.find(user => user.socketId === socketId);
    return user?.userId;
};