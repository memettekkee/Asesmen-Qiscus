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
        
    }

    socket.on('send_message', (data) => sendMsgHandler(io, socket, data));
    socket.on('get_messages', (data) => getMsgHandler(socket, data));
    socket.on('join_conversation', (data) => joinConversationHandler(socket, data));
    socket.on('get_conversations', (data) => getConversationsHandler(socket, data));
    socket.on('initialize_user_rooms', (data) => initializeRoomsHandler(io, socket, data));
    socket.on('typing_start', (data) => typingStartHandler(socket, data));
    socket.on('typing_end', (data) => typingEndHandler(socket, data));
    socket.on('leave_conversation', (data) => leaveConversationHandler(socket, data));
    socket.on('add_participant', (data) => addParticipantHandler(io, socket, data));
    socket.on('remove_participant', (data) => removeParticipantHandler(io, socket, data));
    socket.on('leave_group', (data) => leaveGroupHandler(io, socket, data));
    socket.on('get_participants', (data) => getParticipantsHandler(socket, data));

    // Handle disconnect
    socket.on('disconnect', () => {
        
        const index = connectedUsers.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
            const userId = connectedUsers[index].userId;
            connectedUsers.splice(index, 1);
            
            io.emit('user_status_changed', {
                userId,
                status: 'offline',
                timestamp: new Date()
            });

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