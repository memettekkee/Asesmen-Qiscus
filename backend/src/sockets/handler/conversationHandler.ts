
import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { getUserConversations,  } from '../../model/conversationModel';
import { isUserInConversation } from '../../model/messageModel';

export const initializeRoomsHandler = async (
    io: SocketIOServer,
    socket: SocketWithUser, 
    data?: any
) => {
    try {
        
        const userId = socket.data.user?.id;

        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        const userConversations = await getUserConversations(userId);
        
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

        userConversations.forEach(conversation => {
            socket.to(conversation.id).emit('user_status_changed', {
                userId,
                status: 'online',
                conversationId: conversation.id,
                timestamp: new Date()
            });
        });

    } catch (error: any) {
        console.error('Error initializing user rooms:', error);
        socket.emit('error', { message: error.message || 'Failed to initialize rooms' });
    }
};

export const getConversationsHandler = async (
    socket: SocketWithUser, 
    data?: any
) => {
    try {
        
        const userId = socket.data.user?.id;

        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        const conversations = await getUserConversations(userId);

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
};

export const joinConversationHandler = async (
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

        socket.join(conversationId);
        
        socket.emit('joined_conversation', { 
            success: true,
            conversationId,
            message: 'Successfully joined conversation'
        });
        
    } catch (error: any) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: error.message || 'Failed to join conversation' });
    }
};

export const leaveConversationHandler = (
    socket: SocketWithUser, 
    data: any
) => {
    try {
        
        const { conversationId } = data;
        const userId = socket.data.user?.id;

        if (!userId || !conversationId) {
            socket.emit('error', { message: 'User ID and Conversation ID are required' });
            return;
        }

        socket.leave(conversationId);
        
        socket.emit('left_conversation', {
            success: true,
            conversationId,
            message: 'Successfully left conversation'
        });

    } catch (error) {
        console.error('Error leaving conversation:', error);
        socket.emit('error', { message: 'Failed to leave conversation' });
    }
};
