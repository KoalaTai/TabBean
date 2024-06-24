import express from 'express';
import mongoose from 'mongoose';
import redis from 'redis';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import tabRoutes from './routes/tabs';
import knowledgeBaseRoutes from './routes/knowledgeBase';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose.connect('mongodb://localhost/secure-tab-manager');
const redisClient = redis.createClient();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tabs', tabRoutes);
app.use('/knowledge-base', knowledgeBaseRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });

  socket.on('sendMessage', ({ message, target }) => {
    io.to(target).emit('message', message);
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
