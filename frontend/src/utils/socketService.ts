import { io, Socket } from "socket.io-client";
import { ref } from "vue";

const SOCKET_URL: string = import.meta.env.VITE_API_URL;
let socket: Socket | null = null;
const isConnected = ref(false);

// socket.io connection
export const initializeSocket = (): Socket => {
    if (!socket) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      socket = io(SOCKET_URL, {
        auth: {
          token
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`  
        }
      });
      
      socket.on('connect', () => {
        console.log('Socket connected');
        isConnected.value = true;

        socket?.emit('initialize_user_rooms', {});
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        isConnected.value = false;
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    
    return socket;
  };
  
  export const getSocket = (): Socket => {
    if (!socket) {
      return initializeSocket();
    }
    return socket;
  };
  
  export const disconnectSocket = (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  };
  
  // Expose reactive state
  export const useSocketState = () => {
    return {
      isConnected
    };
  };