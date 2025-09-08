# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制package.json文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 构建阶段 - 前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# 复制前端package.json并安装依赖
COPY client/package*.json ./
RUN npm ci

# 复制前端源代码
COPY client/ ./

# 构建前端应用
RUN npm run build

# 构建阶段 - 后端
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# 复制后端package.json并安装依赖
COPY server/package*.json ./
RUN npm ci --only=production

# 复制后端源代码
COPY server/ ./

# 生产阶段
FROM node:18-alpine AS production

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# 复制根目录package.json
COPY package*.json ./

# 从构建阶段复制文件
COPY --from=backend-builder /app/server ./server
COPY --from=frontend-builder /app/client/build ./client/build

# 复制静态文件服务配置
COPY --from=frontend-builder /app/client/build ./public

# 创建必要的目录
RUN mkdir -p ./server/uploads ./server/logs
RUN chown -R nextjs:nodejs ./server/uploads ./server/logs

# 设置用户
USER nextjs

# 暴露端口
EXPOSE 5000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5000

# 启动命令
CMD ["node", "server/server.js"]