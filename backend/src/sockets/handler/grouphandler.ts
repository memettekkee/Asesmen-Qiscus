
import { Server as SocketIOServer } from 'socket.io';
import { SocketWithUser } from '../../utils/interface';
import { userById } from '../../model/userModel';
import { isGroup, isGroupAdmin } from '../../model/groupConversationModel';
import { addParticipantToGroup, getGroupParticipants, getParticipant, getParticipantById, removeParticipant, leaveGroup } from '../../model/participantModel';
import { connectedUsers } from './handlers';

async function notifyParticipantsChange(io: SocketIOServer, conversationId: string) {
    try {
        const updatedParticipants = await getGroupParticipants(conversationId);
        
        io.to(conversationId).emit('participants_updated', {
            conversationId,
            participants: updatedParticipants
        });
    } catch (error) {
        console.error('Error notifying participant changes:', error);
    }
}

export const getParticipantsHandler = async (
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

        const groupCheck = await isGroup(conversationId);
        if (!groupCheck.isGroup) {
            socket.emit('error', { message: "Conversation isn't a group!" });
            return;
        }

        const userParticipant = await getParticipant(userId, conversationId);
        if (!userParticipant) {
            socket.emit('error', { message: "You are not a member of this group!" });
            return;
        }

        const participants = await getGroupParticipants(conversationId);

        socket.emit('participants_received', {
            success: true,
            conversationId,
            participants,
            count: participants.length
        });

    } catch (error: any) {
        console.error('Error getting participants:', error);
        socket.emit('error', { message: error.message || 'Failed to get participants' });
    }
};

export const addParticipantHandler = async (
    io: SocketIOServer,
    socket: SocketWithUser,
    data: any
) => {
    try {

        const { conversationId, userId } = data;
        const currentUserId = socket.data.user?.id;

        if (!currentUserId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        if (!conversationId || !userId) {
            socket.emit('error', { message: 'Conversation ID and User ID are required' });
            return;
        }

        const groupCheck = await isGroup(conversationId);
        if (!groupCheck.isGroup) {
            socket.emit('error', { message: "Conversation isn't a group!" });
            return;
        }

        const isAdmin = await isGroupAdmin(currentUserId, conversationId);
        if (!isAdmin) {
            socket.emit('error', { message: "Only admin can add members!" });
            return;
        }

        const userToAdd = await userById(userId);
        if (!userToAdd) {
            socket.emit('error', { message: "User not found!" });
            return;
        }

        const participant = await addParticipantToGroup(conversationId, userId);

        socket.emit('participant_added', {
            success: true,
            message: "Member successfully added to group!",
            participant
        });

        socket.to(conversationId).emit('new_participant', {
            conversationId,
            participant
        });

        const userSocketIds = connectedUsers
            .filter(user => user.userId === userId)
            .map(user => user.socketId);

        userSocketIds.forEach(socketId => {
            const userSocket = io.sockets.sockets.get(socketId);
            if (userSocket) {
                userSocket.join(conversationId);

                userSocket.emit('added_to_group', {
                    conversationId,
                    groupName: groupCheck.name || 'Group Chat',
                    addedBy: currentUserId
                });
            }
        });

        await notifyParticipantsChange(io, conversationId);

    } catch (error: any) {
        let errorMessage = error.message || 'Failed to add participant';
        let statusCode = 500;

        if (error.message === 'User is already a participant of this group !') {
            errorMessage = error.message;
            statusCode = 400;
        }

        console.error('Error adding participant:', error);
        socket.emit('error', { 
            message: errorMessage,
            statusCode 
        });
    }
};

export const removeParticipantHandler = async (
    io: SocketIOServer,
    socket: SocketWithUser,
    data: any
) => {
    try {
        
        const { conversationId, participantId } = data;
        const userId = socket.data.user?.id;

        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }

        if (!conversationId || !participantId) {
            socket.emit('error', { message: 'Conversation ID and Participant ID are required' });
            return;
        }

        const groupCheck = await isGroup(conversationId);
        if (!groupCheck.isGroup) {
            socket.emit('error', { message: "Conversation isn't a group!" });
            return;
        }

        const isAdmin = await isGroupAdmin(userId, conversationId);
        if (!isAdmin) {
            socket.emit('error', { message: "Only admin can remove members!" });
            return;
        }

        const participant = await getParticipantById(participantId, conversationId);
        if (!participant || participant.conversationId !== conversationId) {
            socket.emit('error', { message: "Participant not found in this group!" });
            return;
        }

        if (participant.role === 0) {
            const admins = await getGroupParticipants(conversationId);
            const adminCount = admins.filter(p => p.role === 0).length;
            
            if (adminCount <= 1) {
                socket.emit('error', { 
                    message: "Cannot remove the last admin, assign admin role to another member first!" 
                });
                return;
            }
        }

        const removedUserName = participant.user.name;

        await removeParticipant(participantId, conversationId);

        socket.emit('participant_removed', {
            success: true,
            message: "Member successfully removed from group!",
            removedUserId: participantId
        });

        io.to(conversationId).emit('group_notification', {
            type: 'member_removed',
            conversationId,
            message: `${removedUserName} has been removed from the group`,
            timestamp: new Date(),
            metadata: {
                removedUserId: participantId,
                removedByUserId: userId
            }
        });

        const removedUserSocketIds = connectedUsers
            .filter(user => user.userId === participantId)
            .map(user => user.socketId);

        removedUserSocketIds.forEach(socketId => {
            const userSocket = io.sockets.sockets.get(socketId);
            if (userSocket) {
                userSocket.leave(conversationId);
                
                userSocket.emit('removed_from_group', {
                    conversationId,
                    removedBy: userId
                });
            }
        });

        await notifyParticipantsChange(io, conversationId);

    } catch (error: any) {
        console.error('Error removing participant:', error);
        socket.emit('error', { message: error.message || 'Failed to remove participant' });
    }
};

export const leaveGroupHandler = async (
    io: SocketIOServer,
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

        const groupCheck = await isGroup(conversationId);
        if (!groupCheck.isGroup) {
            socket.emit('error', { message: "Conversation isn't a group!" });
            return;
        }

        const userInfo = await userById(userId);
        
        const isAdmin = await isGroupAdmin(userId, conversationId);
        if (isAdmin) {
            const admins = await getGroupParticipants(conversationId);
            const adminCount = admins.filter(p => p.role === 0).length;
            
            if (adminCount <= 1) {
                const participants = await getGroupParticipants(conversationId);
                
                if (participants.length <= 1) {
                    await leaveGroup(userId, conversationId);
                    
                    socket.emit('left_group', {
                        success: true,
                        message: "You have left the group and the group has been deleted because there are no more members!"
                    });
                    
                    socket.leave(conversationId);
                    
                    return;
                }
                
                socket.emit('error', {
                    message: "You are the last admin, assign admin roles to other members first!"
                });
                return;
            }
        }

        await leaveGroup(userId, conversationId);
        
        socket.emit('left_group', {
            success: true,
            message: "You successfully left the group!",
            conversationId
        });
        
        socket.to(conversationId).emit('group_notification', {
            type: 'member_left',
            conversationId,
            message: `${userInfo?.name || 'A member'} has left the group`,
            timestamp: new Date(),
            metadata: {
                leftUserId: userId
            }
        });
        
        socket.leave(conversationId);
        
        await notifyParticipantsChange(io, conversationId);

    } catch (error: any) {
        let errorMessage = error.message || 'Failed to leave group';
        let statusCode = 500;
        
        if (error.message === 'User is not a participant of this group !') {
            errorMessage = error.message;
            statusCode = 400;
        }
        
        console.error('Error leaving group:', error);
        socket.emit('error', { 
            message: errorMessage,
            statusCode
        });
    }
};