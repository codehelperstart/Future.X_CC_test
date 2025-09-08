# 部署指南

本文档详细说明了AI编程学习平台的部署方案和配置。

## 🚀 快速开始

### 前提条件

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 16.0 (本地开发)
- Git

### 开发环境部署

1. **克隆项目**
```bash
git clone https://github.com/your-username/ai-coding-learning-platform.git
cd ai-coding-learning-platform
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库等信息
```

3. **启动开发环境**
```bash
./scripts/deploy.sh development up
```

4. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

### 生产环境部署

1. **使用部署脚本**
```bash
./scripts/deploy.sh production up
```

2. **使用Docker Compose**
```bash
docker-compose up -d
```

## 📋 部署架构

### 开发环境架构
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React)       │    │   (Node.js)     │
│   Port: 3000    │◄──►│   Port: 5000    │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
        ┌─────────────────┐    ┌─────────────────┐
        │   MongoDB       │    │   Redis         │
        │   Port: 27017   │    │   Port: 6379    │
        └─────────────────┘    └─────────────────┘
```

### 生产环境架构
```
                    ┌─────────────────┐
                    │      Nginx      │
                    │   (Reverse      │
                    │    Proxy)       │
                    │   Port: 80/443  │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Backend       │
                    │   (Node.js)     │
                    │   Port: 5000    │
                    └─────────┬───────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
  │   MongoDB       │ │   Redis         │ │   File System   │
  │   Port: 27017   │ │   Port: 6379    │ │   (Uploads)     │
  └─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 🛠️ 配置详解

### 环境变量配置

创建 `.env` 文件并配置以下变量：

```bash
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/ai-coding-platform
DB_NAME=ai-coding-platform

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=5000
NODE_ENV=production

# Redis配置（可选）
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# 邮件配置（可选）
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Docker Compose 服务

#### 开发环境服务
- `mongodb`: MongoDB数据库
- `redis`: Redis缓存
- `backend-dev`: 后端开发服务（热重载）
- `frontend-dev`: 前端开发服务（热重载）

#### 生产环境服务
- `mongodb`: MongoDB数据库
- `redis`: Redis缓存
- `backend`: 后端生产服务
- `nginx`: Nginx反向代理

### Nginx配置

Nginx作为反向代理，提供以下功能：
- 静态文件服务
- API请求代理
- WebSocket支持
- Gzip压缩
- 速率限制
- 安全头设置

主要配置文件：
- `nginx/nginx.conf`: 主配置文件
- `nginx/conf.d/default.conf`: 虚拟主机配置

## 📦 Docker镜像

### 构建镜像

**开发环境镜像**：
```bash
docker build -f Dockerfile.dev -t ai-coding-platform:dev .
```

**生产环境镜像**：
```bash
docker build -t ai-coding-platform:latest .
```

### 镜像优化
- 使用多阶段构建减小镜像大小
- 使用Alpine Linux基础镜像
- 仅安装生产依赖
- 非root用户运行

## 🔧 运维管理

### 部署脚本使用

部署脚本 `scripts/deploy.sh` 提供了完整的部署管理功能：

```bash
# 启动开发环境
./scripts/deploy.sh development up

# 启动生产环境
./scripts/deploy.sh production up

# 查看服务状态
./scripts/deploy.sh production status

# 查看日志
./scripts/deploy.sh production logs

# 重启服务
./scripts/deploy.sh production restart

# 备份数据
./scripts/deploy.sh production backup

# 清理资源
./scripts/deploy.sh production cleanup
```

### 日志管理

日志文件位置：
- 应用日志: `server/logs/app.log`
- Nginx日志: `nginx/logs/`
- Docker日志: `docker logs <container_name>`

查看实时日志：
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend

# 查看最近100行日志
docker-compose logs --tail=100 backend
```

### 数据备份

**手动备份**：
```bash
# 备份MongoDB数据
docker exec ai-coding-mongodb mongodump --out /tmp/backup
docker cp ai-coding-mongodb:/tmp/backup ./backups/

# 备份文件上传
tar -czf uploads-backup.tar.gz server/uploads/
```

**自动备份脚本**：
```bash
./scripts/deploy.sh production backup
```

### 监控和健康检查

**健康检查端点**：
- API健康: `GET /api/health`
- 数据库连接: `GET /api/health/db`
- Redis连接: `GET /api/health/redis`

**Docker健康检查**：
```bash
# 查看容器健康状态
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## 🔐 安全配置

### SSL/TLS配置

1. **获取SSL证书**：
```bash
# 使用Let's Encrypt
certbot certonly --webroot -w /var/www/html -d your-domain.com
```

2. **配置Nginx SSL**：
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
}
```

### 防火墙配置

```bash
# UFW防火墙规则
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 27017/tcp  # 禁止外部访问MongoDB
ufw deny 6379/tcp   # 禁止外部访问Redis
ufw enable
```

## 🌐 云平台部署

### AWS部署

1. **EC2实例配置**：
   - 实例类型: t3.medium (最小)
   - 存储: 20GB SSD
   - 安全组: 允许80, 443, 22端口

2. **RDS数据库**：
   - 引擎: MongoDB Atlas (推荐) 或 DocumentDB
   - 实例类型: t3.medium

3. **ElastiCache Redis**：
   - 节点类型: cache.t3.micro

### 阿里云部署

1. **ECS服务器**：
   - 实例规格: ecs.t5-lc1m2.small
   - 镜像: Ubuntu 20.04

2. **云数据库MongoDB**：
   - 实例规格: dds.mongo.mid

3. **云数据库Redis**：
   - 实例规格: redis.master.small.default

### Vercel部署 (前端)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-api-domain.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

## 🚨 故障排除

### 常见问题

1. **容器启动失败**：
   ```bash
   # 查看详细错误信息
   docker logs <container_name>
   
   # 检查资源使用情况
   docker stats
   ```

2. **数据库连接失败**：
   ```bash
   # 检查MongoDB状态
   docker exec ai-coding-mongodb mongosh --eval "db.adminCommand('ping')"
   ```

3. **前端构建失败**：
   ```bash
   # 清理node_modules重新安装
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **端口冲突**：
   ```bash
   # 查看端口占用
   lsof -i :3000
   lsof -i :5000
   ```

### 性能优化

1. **数据库索引优化**：
```javascript
// 用户集合索引
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })

// 课程集合索引
db.courses.createIndex({ "category": 1, "level": 1 })
db.courses.createIndex({ "title": "text", "description": "text" })
```

2. **Redis缓存策略**：
```javascript
// 缓存热门课程
redis.setex(`courses:popular`, 3600, JSON.stringify(popularCourses))

// 缓存用户会话
redis.setex(`session:${userId}`, 86400, JSON.stringify(userSession))
```

3. **Nginx性能优化**：
```nginx
# 启用HTTP/2
listen 443 ssl http2;

# 增加worker连接数
worker_connections 2048;

# 启用缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📊 CI/CD配置

项目使用GitHub Actions进行持续集成和部署：

- **代码检查**: ESLint, Prettier
- **测试**: Jest, React Testing Library
- **安全扫描**: npm audit, Snyk
- **Docker构建**: 多架构构建
- **自动部署**: 测试环境和生产环境

详细配置见 `.github/workflows/ci.yml`

## 📞 支持

如果在部署过程中遇到问题，请：

1. 查看日志文件排查错误
2. 检查环境变量配置
3. 确认端口是否可用
4. 提交Issue到GitHub仓库

---

更多详细信息请参考：
- [API文档](./API.md)
- [开发指南](../README.md)
- [故障排除FAQ](./FAQ.md)