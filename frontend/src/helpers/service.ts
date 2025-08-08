import type { Conversation, OtherUser } from "../utils/interface";

export const otherUserInfo = (user: Conversation | undefined): OtherUser => {

    const defaultInfo: OtherUser = {
      name: "Unknown",
      avatar: "https://avatar.iran.liara.run/public" 
    };
    
    if (!user) return defaultInfo;
    
    if (user.isGroup) {
      return {
        name: user.name || defaultInfo.name,
        avatar: user.image || defaultInfo.avatar
      };
    }
    
    const currentUserId = localStorage.getItem('userId');
    
    if (!user.participants || user.participants.length === 0) {
      return {
        name: user.name || defaultInfo.name,
        avatar: user.otherUser?.avatar || defaultInfo.avatar
      };
    }
    
    const otherParticipant = user.participants.find(
      p => p.userId !== currentUserId
    );
    
    if (otherParticipant && otherParticipant.user) {
      return {
        name: otherParticipant.user.name || defaultInfo.name,
        avatar: otherParticipant.user.avatar || defaultInfo.avatar
      };
    }
    
    return {
      name: user.name || defaultInfo.name,
      avatar: user.otherUser?.avatar || defaultInfo.avatar
    };
  };