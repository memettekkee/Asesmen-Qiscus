
import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { getUserConversations } from '../../model/conversationModel';

export const conversationHandlers = (io: SocketIOServer, socket: SocketWithUser) => {
    
    // Event: Get all user conversations
    socket.on('get_conversations', async () => {
        try {
            const userId = socket.data.user?.id;

            if (!userId) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            // Ambil semua conversations user
            const conversations = await getUserConversations(userId);

            // Process conversations (untuk personal chat, ambil nama dari participant lain)
            const processedConversations = conversations.map(conv => {
                if (!conv.isGroup) {
                    const otherParticipant = conv.participants.find(
                        p => p.userId !== userId
                    );
                    
                    return {
                        ...conv,
                        name: otherParticipant?.user.name || "Unknown",
                        otherUser: otherParticipant?.user || null,
                        lastMessage: conv.messages[0] || null
                    };
                }
                
                return {
                    ...conv,
                    lastMessage: conv.messages[0] || null
                };
            });

            socket.emit('conversations_received', {
                success: true,
                conversations: processedConversations,
                count: processedConversations.length
            });

        } catch (error: any) {
            console.error('Error getting conversations:', error);
            socket.emit('error', { message: error.message || 'Failed to get conversations' });
        }
    });

    // Event: Auto-join user ke semua conversation rooms saat connect
    socket.on('initialize_user_rooms', async () => {
        try {
            const userId = socket.data.user?.id;

            if (!userId) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            // Ambil semua conversations user
            const userConversations = await getUserConversations(userId);
            
            // Join ke semua conversation rooms
            const joinedRooms: string[] = [];
            userConversations.forEach(conversation => {
                socket.join(conversation.id);
                joinedRooms.push(conversation.id);
            });

            socket.emit('rooms_initialized', {
                success: true,
                joinedRooms,
                message: `Joined ${joinedRooms.length} conversation rooms`
            });

            // Notify other participants bahwa user ini online
            userConversations.forEach(conversation => {
                socket.to(conversation.id).emit('user_status_changed', {
                    userId,
                    status: 'online',
                    conversationId: conversation.id,
                    timestamp: new Date()
                });
            });

            console.log(`User ${userId} initialized and joined ${joinedRooms.length} rooms`);

        } catch (error: any) {
            console.error('Error initializing user rooms:', error);
            socket.emit('error', { message: error.message || 'Failed to initialize rooms' });
        }
    });

};