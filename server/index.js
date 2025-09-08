const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const courseRoutes = require('./routes/courses');
const codeRoutes = require('./routes/code');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-learning-platform';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ 已连接到MongoDB数据库');
  })
  .catch((error) => {
    console.error('❌ MongoDB连接失败:', error.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/code', codeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'AI编程学习平台API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🤖 欢迎来到AI编程学习平台API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      courses: '/api/courses',
      code: '/api/code'
    }
  });
});

io.on('connection', (socket) => {
  console.log('👤 用户已连接:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`👤 用户 ${socket.id} 加入房间 ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`👤 用户 ${socket.id} 离开房间 ${roomId}`);
  });

  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('receive-message', {
      id: Date.now(),
      message: data.message,
      username: data.username,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('👤 用户已断开连接:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API路由不存在',
    message: `路径 ${req.originalUrl} 未找到`
  });
});

server.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`🌐 API地址: http://localhost:${PORT}`);
  console.log(`📖 API文档: http://localhost:${PORT}/api/health`);
});