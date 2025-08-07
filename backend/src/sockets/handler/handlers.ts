import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { sendMsgHandler, getMsgHandler, typingStartHandler, typingEndHandler } from './msgHandler';
import { joinConversationHandler, getConversationsHandler, initializeRoomsHandler, leaveConversationHandler } from './conversationHandler';
import { addParticipantHandler, removeParticipantHandler, leaveGroupHandler, getParticipantsHandler } from './grouphandler';

export const connectedUsers: Array<{userId: string, socketId: string}> = [];

export const socketHandlers = (io: SocketIOServer, socket: SocketWithUser) => {

    if (socket.data.user) {
        connectedUsers.push({
            userId: socket.data.user.id,
            socketId: socket.id
        });
        
        console.log(`User ${socket.data.user.id} connected with socket ${socket.id}`);
    }

    socket.on('message', (rawMessage) => {
        try {
            let parsedData;
            
            if (typeof rawMessage === 'string') {
                parsedData = JSON.parse(rawMessage);
            } else {
                parsedData = rawMessage;
            }

            const { event, data } = parsedData;
            
            console.log(`Parsed event: ${event}`, data);

            switch (event) {
                case 'initialize_user_rooms':
                    initializeRoomsHandler(io, socket, data);
                    break;
                case 'send_message':
                    sendMsgHandler(io, socket, data);
                    break;
                case 'get_messages':
                    getMsgHandler(socket, data);
                    break;
                case 'join_conversation':
                    joinConversationHandler(socket, data);
                    break;
                case 'get_conversations':
                    getConversationsHandler(socket, data);
                    break;
                case 'typing_start':
                    typingStartHandler(socket, data);
                    break;
                case 'typing_end':
                    typingEndHandler(socket, data);
                    break;
                case 'leave_conversation':
                    leaveConversationHandler(socket, data);
                    break;
                case 'add_participant':
                    addParticipantHandler(io, socket, data);
                    break;
                case 'remove_participant':
                    removeParticipantHandler(io, socket, data);
                    break;
                case 'leave_group':
                    leaveGroupHandler(io, socket, data);
                    break;
                case 'get_participants':
                    getParticipantsHandler(socket, data);
                    break;
                    
                default:
                    console.log(`Unknown event: ${event}`);
                    socket.emit('error', { message: `Unknown event: ${event}` });
            }
            
            // Emit ke handler yang sesuai
            socket.emit(event, data || {});
            
        } catch (error) {
            console.error('Error parsing message:', error);
            socket.emit('error', { message: 'Invalid message format' });
        }
    });

    // socket.on('send_message', (data) => sendMsgHandler(io, socket, data));
    // socket.on('get_messages', (data) => getMsgHandler(socket, data));
    // socket.on('join_conversation', (data) => joinConversationHandler(socket, data));
    // socket.on('get_conversations', (data) => getConversationsHandler(socket, data));
    // socket.on('initialize_user_rooms', (data) => initializeRoomsHandler(io, socket, data));
    // socket.on('typing_start', (data) => typingStartHandler(socket, data));
    // socket.on('typing_end', (data) => typingEndHandler(socket, data));
    // socket.on('leave_conversation', (data) => leaveConversationHandler(socket, data));

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        const index = connectedUsers.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
            const userId = connectedUsers[index].userId;
            connectedUsers.splice(index, 1);
            
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