import axios from "axios"; 
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import type { 
    AuthResponse, 
    LoginResponse,
    GeneralResponse,
    LoginForm, 
    RegisterForm,
    UpdateUserForm,
    ConversationForm, 
    UserResponse,
    User,
    Conversation,
    // ConversationsResponse,
    Participant,
    // Message,
    // AllMessagesResponse,
    // SendMessagesResponse,
    GeneralConversationResponse,
    ParticipantResponse,
    UserListResponse
} from "./interface";

const API_URL: string = import.meta.env.VITE_API_URL as string;

const API: AxiosInstance = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string | null = localStorage.getItem("token");
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

export const loginUser = async (formData: LoginForm): Promise<AuthResponse> => {
  try {
    const response = await API.post<LoginResponse>("/login", formData);
    if (response.data.token && response.data.user) {
        return {
          message: response.data.message,
          token: response.data.token,
          user: response.data.user
        };
      } else {

        throw new Error("Failed to login");
      }
  } catch (error) {
    const axiosError = error as AxiosError<LoginResponse>;
    const errorMessage = axiosError.response?.data?.message || "Failed to login";
    throw new Error(errorMessage); 
  }
};

export const registerUser = async (formData: RegisterForm): Promise<UserResponse> => {
  try {
    const response = await API.post<UserResponse>("/register", formData);
    if (response.data.user) {
        return response.data;
      } else {

        throw new Error("Failed to register");
      }
  } catch (error) {
    const axiosError = error as AxiosError<UserResponse>;
    const errorMessage = axiosError.response?.data?.message || "Failed to register";
    throw new Error(errorMessage); 
  }
};

export const getUserProfile = async (): Promise<User | null> => {
    try {
        const response = await API.get<UserResponse>("/profile/detail");
        if (response.data.user) {
            return response.data.user;
          } else {
            throw new Error("Failed to fetch user profile");
          }
    } catch (error) {
        const axiosError = error as AxiosError<UserResponse>;
        if (axiosError.response) {
            switch (axiosError.response.status) {
              case 401:
                localStorage.removeItem("token"); 
                throw new Error("Unauthorized. Please log in again.");
              default:
                throw axiosError.response.data?.message || "Failed to fetch user profile";
            }
          } else if (axiosError.request) {
            throw new Error("No response received from server");
          } else {
            throw new Error("Error setting up the request");
          }
    }
}

export const updateUserProfile = async (formData: UpdateUserForm): Promise<UserResponse> => {
  try {
    const response = await API.put<UserResponse>("/profile/update", formData);
    if (response.data.user) {
      return response.data;
    } else {
      throw new Error("Failed to register");
    }
  } catch (error) {
    const axiosError = error as AxiosError<UserResponse>;
    if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            localStorage.removeItem("token"); 
            throw new Error("Unauthorized. Please log in again.");
          default:
            throw axiosError.response.data?.message || "Failed to update user profile";
        }
      } else if (axiosError.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error("Error setting up the request");
      }
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await API.get<UserListResponse>("/members");
    if (response.data.userList) {
      return response.data.userList;
    } else {
      throw new Error("Failed to get all members");
    }
  } catch (error) {
    const axiosError = error as AxiosError<UserListResponse>;
    if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            localStorage.removeItem("token"); 
            throw new Error("Unauthorized. Please log in again.");
          default:
            throw axiosError.response.data?.message || "Failed to get all members";
        }
      } else if (axiosError.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error("Error setting up the request");
      }
  }
}

export const startChat = async (data: { receiverId: string }): Promise<Conversation> => {
  try {
    const response = await API.post<GeneralConversationResponse>("/conversations", data);
    if (response.data.conversation) {
      return response.data.conversation;
    } else {
      throw new Error("Failed to start chat");
    }
  } catch (error) {
    const axiosError = error as AxiosError<GeneralConversationResponse>;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          localStorage.removeItem("token"); 
          throw new Error("Unauthorized. Please log in again.");
        default:
          const errorMessage = axiosError.response.data?.message || "Failed to start chat";
          throw new Error(errorMessage); 
      }
    } else if (axiosError.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}

export const startGroup = async (formData: ConversationForm): Promise<Conversation> => {
  try {
    const response = await API.post<GeneralConversationResponse>("/groups", formData);
    if (response.data.conversation) {
      return response.data.conversation;
    } else {
      throw new Error("Failed to start a group");
    }
  } catch (error) {
    const axiosError = error as AxiosError<GeneralConversationResponse>;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          localStorage.removeItem("token"); 
          throw new Error("Unauthorized. Please log in again.");
        default:
          throw axiosError.response.data?.message || "Failed to start a group";
      }
    } else if (axiosError.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}

export const updateRole = async (conversationId: string, participantId: string, data: { role: number }): Promise<Participant[]> => {
  try {
    const response = await API.put<ParticipantResponse>(`/conversations/${conversationId}/participants/${participantId}/role`, data);
    if (response.data.participant) {
      return response.data.participant;
    } else {
      throw new Error("Failed to update user role");
    }
  } catch (error) {
    const axiosError = error as AxiosError<ParticipantResponse>;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          localStorage.removeItem("token"); 
          throw new Error("Unauthorized. Please log in again.");
        default:
          throw axiosError.response.data?.message || "Failed to update user role";
      }
    } else if (axiosError.request) {
      throw new Error("No response received from server")
    } else {
      throw new Error("Error setting up the request");
    }
  }
}

export const updateGroupInfo = async (conversationId: string, formData: ConversationForm): Promise<Conversation> => {
  try {
    const response = await API.put<GeneralConversationResponse>(`/conversations/${conversationId}`, formData);
    if (response.data.conversation) {
      return response.data.conversation;
    } else {
      throw new Error("Failed to update group info");
    }
  } catch (error) {
    const axiosError = error as AxiosError<GeneralConversationResponse>;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          localStorage.removeItem("token"); 
          throw new Error("Unauthorized. Please log in again.");
        default:
          throw axiosError.response.data?.message || "Failed to update group info";
      }
    } else if (axiosError.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}

export const deleteTheGroup = async (conversationId: string): Promise<GeneralResponse> => {
  try {
    const response = await API.delete<GeneralResponse>(`/conversations/${conversationId}`);
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<GeneralResponse>;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          localStorage.removeItem("token"); 
          throw new Error("Unauthorized. Please log in again.");
        default:
          throw axiosError.response.data?.message || "Failed to delete the group";
      }
    } else if (axiosError.request) {
      throw new Error("No response received from server")
    } else {
      throw new Error("Error setting up the request");
    }
  }
}

export const uploadFile = async (file: File): Promise<{fileUrl: string, fileType: string}> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      fileUrl: response.data.fileUrl,
      fileType: response.data.fileType
    };
  } catch (error) {
    const axiosError = error as AxiosError<{message?: string}>;
    throw new Error(axiosError.response?.data?.message || 'Upload failed');
  }
};
