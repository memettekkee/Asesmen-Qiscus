import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { isUserInConversation, createMessage, getMessages } from '../../model/messageModel';
import { updatedConversation } from '../../model/conversationModel';

export const messageHandler = (io: SocketIOServer, socket: SocketWithUser) => {
    
    // Event: Join conversation room
    socket.on('join_conversation', async (data) => {
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

            // Cek apakah user adalah participant
            const isParticipant = await isUserInConversation(userId, conversationId);
            if (!isParticipant) {
                socket.emit('error', { message: "You don't have access to this conversation!" });
                return;
            }

            // Join room
            socket.join(conversationId);
            
            socket.emit('joined_conversation', { 
                success: true,
                conversationId,
                message: 'Successfully joined conversation'
            });

            console.log(`User ${userId} joined conversation ${conversationId}`);
            
        } catch (error: any) {
            console.error('Error joining conversation:', error);
            socket.emit('error', { message: error.message || 'Failed to join conversation' });
        }
    });

    // Event: Get messages from conversation
    socket.on('get_messages', async (data) => {
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

            // Validasi user adalah participant
            const isParticipant = await isUserInConversation(userId, conversationId);
            if (!isParticipant) {
                socket.emit('error', { message: "You don't have access to this conversation!" });
                return;
            }

            // Ambil semua messages
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
    });

    // Event: Send message
    socket.on('send_message', async (data) => {
        try {
            const { conversationId, content, type = 'TEXT' } = data;
            const userId = socket.data.user?.id;

            if (!userId) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            // Validasi input
            if (!conversationId) {
                socket.emit('error', { message: 'Conversation ID is required' });
                return;
            }

            if (!content || content.trim() === '') {
                socket.emit('error', { message: 'Message content cannot be empty!' });
                return;
            }

            // Validasi user adalah participant
            const isParticipant = await isUserInConversation(userId, conversationId);
            if (!isParticipant) {
                socket.emit('error', { message: "You don't have access to this conversation!" });
                return;
            }

            // Buat message baru
            const newMessage = await createMessage(conversationId, userId, content, type);

            // Join room jika belum (safety measure)
            socket.join(conversationId);

            // Broadcast message ke semua participant di room
            io.to(conversationId).emit('message_received', {
                success: true,
                message: newMessage,
                conversationId
            });

            // Update conversation timestamp
            const updatedConv = await updatedConversation(conversationId);
            if (updatedConv) {
                io.to(conversationId).emit('conversation_updated', {
                    conversation: updatedConv
                });
            }

            // Konfirmasi ke sender
            socket.emit('message_sent', { 
                success: true, 
                messageId: newMessage.id,
                message: 'Message sent successfully'
            });

            console.log(`Message sent by ${userId} in conversation ${conversationId}`);

        } catch (error: any) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: error.message || 'Failed to send message' });
        }
    });

    // Event: Typing indicators
    socket.on('typing_start', (data) => {
        try {
            const { conversationId } = data;
            const userId = socket.data.user?.id;

            if (!userId || !conversationId) return;

            // Broadcast typing indicator ke participant lain
            socket.to(conversationId).emit('user_typing', {
                userId,
                conversationId,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error handling typing start:', error);
        }
    });

    socket.on('typing_end', (data) => {
        try {
            const { conversationId } = data;
            const userId = socket.data.user?.id;

            if (!userId || !conversationId) return;

            // Broadcast stop typing ke participant lain
            socket.to(conversationId).emit('user_stopped_typing', {
                userId,
                conversationId,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error handling typing end:', error);
        }
    });

    // Event: Leave conversation
    socket.on('leave_conversation', (data) => {
        try {
            const { conversationId } = data;
            const userId = socket.data.user?.id;

            if (!userId || !conversationId) return;

            socket.leave(conversationId);
            
            socket.emit('left_conversation', {
                success: true,
                conversationId,
                message: 'Successfully left conversation'
            });

            console.log(`User ${userId} left conversation ${conversationId}`);

        } catch (error) {
            console.error('Error leaving conversation:', error);
        }
    });

};