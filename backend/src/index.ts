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

app.use(express.json());
app.use(cors({ 
    credentials: true,
    origin: [
        'http://localhost:5173', // Local development
        'https://asesmen-qiscus-auyw.vercel.app', // Production frontend
        'https://asesmen-qiscus-auyw.vercel.app/' // Production frontend with trailing slash
    ]
}));

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