import { getSocket } from "./socketService";
import type { Conversation, Message, Participant } from "./interface";

type Events = {
    'new-message': Message;
    'user-typing': { userId: string; conversationId: string };
    'user-stopped-typing': { userId: string; conversationId: string };
    'conversation-updated': Conversation;
    'participants-updated': { conversationId: string; participants: Participant[] };
    'group-notification': { 
      type: string; 
      conversationId: string; 
      message: string; 
      timestamp: string; 
      metadata?: any 
    };
    'added-to-group': { 
      conversationId: string; 
      groupName: string; 
      addedBy: string 
    };
    'removed-from-group': { 
      conversationId: string; 
      removedBy: string 
    };
    'role-changed': { 
      conversationId: string; 
      role: 'ADMIN' | 'MEMBER'; 
      changedBy: string 
    };
    'user-status-changed': { 
      userId: string; 
      status: 'online' | 'offline'; 
      conversationId?: string 
    };
  }

import mitt from 'mitt'
export const emitter = mitt<Events>();

// GET /conversations
export const getConversationsIo = (): Promise<Conversation[]> => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      
      // console.log('Emitting get_conversations event');
      socket.emit('get_conversations');
      // console.log('getconverio jalan')
      
      socket.once('conversations_received', (data: { conversations: Conversation[] }) => {
        resolve(data.conversations);
      });
      
      socket.once('error', (error: { message?: string }) => {
        reject(new Error(error.message || 'Failed to get conversations'));
      });
      
      setTimeout(() => {
        reject(new Error('Server timeout: No response received'));
      }, 5000);
    });
  };

export const sendMsgIo = (conversationId: string, content: string, type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' = 'TEXT'): Promise<Message> => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        
        socket.emit('send_message', { conversationId, content, type });
        
        socket.once('message_sent', (response: { success: boolean, data: Message, message?: string }) => {
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.message || 'Failed to send message'));
            }
          });
        
        socket.once('error', (error) => {
          reject(new Error(error.message || 'Failed to send message'));
        });
        
        setTimeout(() => {
          reject(new Error('Server timeout: No response received'));
        }, 5000);
      });
}

export const getMsgIo = (conversationId: string): Promise<Message[]> => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        
        socket.emit('get_messages', { conversationId });
        // console.log('getmsgio jalan')
        
        socket.once('messages_received', (data: { conversationId: string, messages: Message[] }) => {
            if (data.conversationId === conversationId) {
              resolve(data.messages);
            } else {
              reject(new Error('Received messages for wrong conversation'));
            }
          });
        
        socket.once('error', (error) => {
          reject(new Error(error.message || 'Failed to get messages'));
        });
        
        setTimeout(() => {
          reject(new Error('Server timeout: No response received'));
        }, 1000);
      });
}

export const joinConversationIo = (conversationId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        
        socket.emit('join_conversation', { conversationId });
        
        socket.once('joined_conversation', (data) => {
            if (data.success && data.conversationId === conversationId) {
                resolve();
            } else {
                reject(new Error('Failed to join conversation'));
            }
        });
        
        socket.once('error', (error) => {
            reject(new Error(error.message || 'Failed to join conversation'));
        });
        
        setTimeout(() => {
            reject(new Error('Server timeout: No response received'));
        }, 5000);
    });
}

export const initializeUserRoomsIo = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        
        socket.emit('initialize_user_rooms', {});
        
        socket.once('rooms_initialized', (data) => {
            if (data.success) {
                resolve(data.joinedRooms);
            } else {
                reject(new Error('Failed to initialize rooms'));
            }
        });
        
        socket.once('error', (error) => {
            reject(new Error(error.message || 'Failed to initialize rooms'));
        });
        
        setTimeout(() => {
            reject(new Error('Server timeout'));
        }, 5000);
    });
}

let listenersInitialized = false;
export const setupMessageListenerIo = () => {
    // const socket = getSocket();

    if (listenersInitialized) {
      return;
    }
    
    const socket = getSocket();
    
    socket.off('message_received');
    socket.off('conversation_updated');
    socket.off('user_typing');
    socket.off('user_stopped_typing');
    socket.off('participants_updated');
    
    socket.on('message_received', (data) => {
        emitter.emit('new-message', data.message);
    });
    
    socket.on('conversation_updated', (data) => {
        // console.log("cekkk", data.conversation);
        emitter.emit('conversation-updated', data.conversation);
    });
    
    socket.on('user_typing', (data) => {
        emitter.emit('user-typing', data);
    });
    
    socket.on('user_stopped_typing', (data) => {
        emitter.emit('user-stopped-typing', data);
    });
    
    socket.on('participants_updated', (data) => {
        emitter.emit('participants-updated', data);
    });

    initializeUserRoomsIo().catch(console.error);
    
    listenersInitialized = true;
  };

export const sendTypingStatusIo = (conversationId: string, isTyping: boolean) => {
    const socket = getSocket();
    
    if (isTyping) {
      socket.emit('typing_start', { conversationId });
    } else {
      socket.emit('typing_end', { conversationId });
    }
  };

export const getParticipantsIo = (conversationId: string): Promise<Participant[]> => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      
      socket.emit('get_participants', { conversationId });
      
      socket.once('participants_received', (data: { conversationId: string, participants: Participant[] }) => {
        if (data.conversationId === conversationId) {
          resolve(data.participants);
        } else {
          reject(new Error('Received participants for wrong conversation'));
        }
      });
      
      socket.once('error', (error: { message?: string }) => {
        reject(new Error(error.message || 'Failed to get participants'));
      });
      
      setTimeout(() => {
        reject(new Error('Server timeout: No response received'));
      }, 5000);
    });
  };

export const addParticipantIo = (conversationId: string, userId: string): Promise<Participant> => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      
      socket.emit('add_participant', { conversationId, userId });
      
      socket.once('participant_added', (response: { success: boolean, participant: Participant, message?: string }) => {
        if (response.success) {
          resolve(response.participant);
        } else {
          reject(new Error(response.message || 'Failed to add participant'));
        }
      });
      
      socket.once('error', (error: { message?: string }) => {
        reject(new Error(error.message || 'Failed to add participant'));
      });
      
      setTimeout(() => {
        reject(new Error('Server timeout: No response received'));
      }, 5000);
    });
  };

export const removeParticipantIo = (conversationId: string, participantId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      
      socket.emit('remove_participant', { conversationId, participantId });
      
      socket.once('participant_removed', (response: { success: boolean, message?: string }) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error(response.message || 'Failed to remove participant'));
        }
      });
      
      socket.once('error', (error: { message?: string }) => {
        reject(new Error(error.message || 'Failed to remove participant'));
      });
      
      setTimeout(() => {
        reject(new Error('Server timeout: No response received'));
      }, 5000);
    });
  };

export const leaveGroupIo = (conversationId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      
      socket.emit('leave_group', { conversationId });
      
      socket.once('left_group', (response: { success: boolean, message?: string }) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error(response.message || 'Failed to leave group'));
        }
      });
      
      socket.once('error', (error: { message?: string }) => {
        reject(new Error(error.message || 'Failed to leave group'));
      });
      
      setTimeout(() => {
        reject(new Error('Server timeout: No response received'));
      }, 5000);
    });
  };
