import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket) return socket;

  // Connect to the backend server
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://apexsim-backend.onrender.com';
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    transports: ['websocket'],
    upgrade: false,
  });

  socket.on('connect', () => {});

  socket.on('disconnect', () => {});

  socket.on('error', () => {});

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket || initializeSocket();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
