import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { initializeSocket } from './sockets/socket_init';

import userRoute from './routes/userRoutes'
import chatRoute from './routes/chatRoutes'
import groupChatRoute from './routes/groupChatRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi CORS
const allowedOrigins = [
    'https://asesmen-qiscus-auyw.vercel.app', // Production FE
    'http://localhost:5173' // Development FE
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  app.options('*', cors());

app.use('/', userRoute)
app.use('/', chatRoute)
app.use('/', groupChatRoute)

const server = http.createServer(app);

const io = initializeSocket(server);

// Di server utama
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});