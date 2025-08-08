import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { isUserInConversation, createMessage, getMessages } from '../../model/messageModel';
import { updatedConversation } from '../../model/conversationModel';

export const sendMsgHandler = async (
    io: SocketIOServer, 
    socket: SocketWithUser, 
    data: any
) => {
    try {

        const { conversationId, content, type = 'TEXT' } = data;
        const userId = socket.data.user?.id;

        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        if (!conversationId) {
            socket.emit('error', { message: 'Conversation ID is required' });
            return;
        }

        if (!content || content.trim() === '') {
            socket.emit('error', { message: 'Message content cannot be empty!' });
            return;
        }

        const isParticipant = await isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            socket.emit('error', { message: "You don't have access to this conversation!" });
            return;
        }

        const newMessage = await createMessage(conversationId, userId, content, type);

        socket.join(conversationId);

        io.to(conversationId).emit('message_received', {
            success: true,
            message: newMessage,
            conversationId
        });

        const updatedConv = await updatedConversation(conversationId);
        if (updatedConv) {
            io.to(conversationId).emit('conversation_updated', {
                conversation: updatedConv
            });
        }

        socket.emit('message_sent', { 
            success: true, 
            messageId: newMessage.id,
            message: 'Message sent successfully'
        });


    } catch (error: any) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: error.message || 'Failed to send message' });
    }
};

export const getMsgHandler = async (
    socket: SocketWithUser, 
    data: any
) => {
    try {
        
        const { conversationId } = data;
        const userId = socket.data.user?.id;

        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        if (!conversationId) {
            socket.emit('error', { message: 'Conversation ID is required' });
            return;
        }

        const isParticipant = await isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            socket.emit('error', { message: "You don't have access to this conversation!" });
            return;
        }

        const messages = await getMessages(conversationId);

        socket.emit('messages_received', {
            success: true,
            conversationId,
            messages,
            count: messages.length
        });

    } catch (error: any) {
        console.error('Error getting messages:', error);
        socket.emit('error', { message: error.message || 'Failed to get messages' });
    }
};

export const typingStartHandler = (
    socket: SocketWithUser, 
    data: any
) => {
    try {
        
        const { conversationId } = data;
        const userId = socket.data.user?.id;

        if (!userId || !conversationId) {
            return;
        }

        socket.to(conversationId).emit('user_typing', {
            userId,
            conversationId,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error handling typing start:', error);
    }
};

export const typingEndHandler = (
    socket: SocketWithUser, 
    data: any
) => {
    try {
        
        const { conversationId } = data;
        const userId = socket.data.user?.id;

        if (!userId || !conversationId) {
            return;
        }

        socket.to(conversationId).emit('user_stopped_typing', {
            userId,
            conversationId,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error handling typing end:', error);
    }
};

