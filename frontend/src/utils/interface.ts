export interface GeneralResponse {
  error?: boolean;
  message: string;
}

export interface LoginResponse {
    error: boolean;
    message: string;
    user?: User;
    token?: string;
  }

export interface User {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse extends GeneralResponse {
    user: User;
    token: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface UpdateUserForm {
  name: string;
  email: string;
  avatar?: string;
  // location: string;
}

export interface ConversationForm {
  name: string,
  image?: string
}

export interface UserResponse {
    error: boolean;
    message: string;
    user: User;
  }

export interface Message {
    id: string;
    content: string;
    userId: string;
    conversationId: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    user: MessageUser;
  }
  
  export interface Participant {
    id: string;
    userId: string;
    conversationId: string;
    role: number;
    createdAt: string;
    updatedAt: string;
    user: User;
  }
  
  export interface Conversation {
    id: string;
    name?: string;
    image?: string;
    isGroup: boolean;
    createdAt: string;
    updatedAt: string;
    participants: Participant[];
    messages?: Message[];
    otherUser?: User;
    lastMessage?: Message | null;
  }
  
  export interface ConversationsResponse extends GeneralResponse {
    conversations: Conversation[];
  }

  export interface GeneralConversationResponse extends GeneralResponse {
    conversation: Conversation;
  }

  export interface MessageUser {
    id: string;
    name: string;
    avatar: string | null;
  }

  export interface AllMessagesResponse extends GeneralResponse {
    allMsg: Message[];
  }

  export interface SendMessagesResponse extends GeneralResponse {
    data: Message[];
  }

  export interface ParticipantResponse extends GeneralResponse {
    participant: Participant[];
  }

  export interface UserListResponse extends GeneralResponse {
    userList: User[]
  }

  export interface ChatResult {
    conversations: Conversation[];
    currentChat: Conversation | null;
  }

  export interface MappedMessage {
    id: string;
    text: string;
    author?: string;
    avatar?: string | null;
    time: string;
    sender: string;
  }

  export interface MessageResult {
    messages: Message[];
    mappedMessages: MappedMessage[];
  }

  export interface OtherUser {
    name: string,
    avatar: string
  }

  export interface TypingUsers {
    [userId: string]: string;
  }
