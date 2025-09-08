# API 接口文档

本文档详细描述了AI编程学习平台的后端API接口。

## 基本信息

- **Base URL**: `http://localhost:5000/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证

大多数API接口需要用户认证。在请求头中包含JWT token：

```
Authorization: Bearer your-jwt-token
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": { /* 响应数据 */ }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  }
}
```

## 用户认证接口

### POST /auth/register
用户注册

**请求体**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "张三",
      "email": "zhangsan@example.com",
      "role": "student",
      "createdAt": "2024-03-XX"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
用户登录

**请求体**:
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "张三",
      "email": "zhangsan@example.com",
      "role": "student",
      "avatar": "avatar_url"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/logout
用户登出

**请求头**: 需要认证
**响应**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

### POST /auth/forgot-password
忘记密码

**请求体**:
```json
{
  "email": "zhangsan@example.com"
}
```

### POST /auth/reset-password
重置密码

**请求体**:
```json
{
  "token": "reset_token",
  "password": "new_password",
  "confirmPassword": "new_password"
}
```

## 用户管理接口

### GET /users/profile
获取当前用户信息

**请求头**: 需要认证
**响应**:
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "张三",
    "email": "zhangsan@example.com",
    "bio": "个人简介",
    "avatar": "avatar_url",
    "location": "北京",
    "website": "https://example.com",
    "socialLinks": {
      "github": "username",
      "twitter": "username"
    },
    "settings": {
      "emailNotifications": true,
      "privacy": "public"
    },
    "stats": {
      "coursesCompleted": 5,
      "totalLearningTime": 3600,
      "postsCount": 12
    }
  }
}
```

### PUT /users/profile
更新用户信息

**请求头**: 需要认证
**请求体** (multipart/form-data):
```json
{
  "name": "李四",
  "bio": "新的个人简介",
  "location": "上海"
}
```

### POST /users/upload-avatar
上传头像

**请求头**: 需要认证
**请求体**: multipart/form-data
- `avatar`: 图片文件

### PUT /users/change-password
修改密码

**请求头**: 需要认证
**请求体**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### GET /users/:id
获取指定用户公开信息

**响应**:
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "张三",
    "bio": "个人简介",
    "avatar": "avatar_url",
    "location": "北京",
    "joinedAt": "2024-01-XX",
    "stats": {
      "coursesCompleted": 5,
      "postsCount": 12
    }
  }
}
```

## 课程管理接口

### GET /courses
获取课程列表

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 12)
- `category`: 分类筛选
- `level`: 难度级别 (beginner/intermediate/advanced)
- `search`: 搜索关键词
- `sort`: 排序方式 (latest/popular/rating)
- `isPremium`: 是否付费课程

**响应**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "course_id",
        "title": "Python基础入门",
        "description": "课程描述",
        "category": "python",
        "level": "beginner",
        "thumbnail": "image_url",
        "instructor": {
          "_id": "instructor_id",
          "name": "导师姓名",
          "avatar": "avatar_url"
        },
        "price": 99,
        "rating": 4.8,
        "studentsCount": 1200,
        "duration": 480,
        "createdAt": "2024-03-XX"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 10,
      "total": 120,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /courses/:id
获取课程详情

**响应**:
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "title": "Python基础入门",
    "description": "详细课程描述",
    "longDescription": "更详细的描述",
    "category": "python",
    "level": "beginner",
    "thumbnail": "image_url",
    "instructor": {
      "_id": "instructor_id",
      "name": "导师姓名",
      "avatar": "avatar_url",
      "bio": "导师简介"
    },
    "curriculum": [
      {
        "title": "第一章：Python简介",
        "lessons": [
          {
            "title": "什么是Python",
            "duration": 15,
            "type": "video",
            "preview": true
          }
        ]
      }
    ],
    "objectives": [
      "掌握Python基础语法",
      "能够编写简单的Python程序"
    ],
    "requirements": [
      "具备基本的计算机操作能力"
    ],
    "price": 99,
    "rating": 4.8,
    "reviewCount": 156,
    "studentsCount": 1200,
    "duration": 480,
    "isEnrolled": false,
    "isBookmarked": false
  }
}
```

### POST /courses/:id/enroll
报名课程

**请求头**: 需要认证
**响应**:
```json
{
  "success": true,
  "message": "报名成功",
  "data": {
    "enrollment": {
      "courseId": "course_id",
      "userId": "user_id",
      "enrolledAt": "2024-03-XX",
      "progress": {
        "percentage": 0,
        "completedLessons": [],
        "currentLesson": null
      }
    }
  }
}
```

### GET /courses/:id/progress
获取课程学习进度

**请求头**: 需要认证
**响应**:
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "progress": {
      "percentage": 35,
      "completedLessons": ["lesson1", "lesson2"],
      "currentLesson": "lesson3",
      "totalTime": 180,
      "lastAccessed": "2024-03-XX"
    }
  }
}
```

### PUT /courses/:id/progress/:lessonId
更新课程进度

**请求头**: 需要认证
**请求体**:
```json
{
  "completed": true,
  "timeSpent": 25,
  "quiz_score": 85
}
```

## 社区管理接口

### GET /community/posts
获取帖子列表

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `category`: 分类筛选
- `sort`: 排序方式 (latest/popular/trending)
- `search`: 搜索关键词

**响应**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "title": "如何学好Python？",
        "excerpt": "帖子摘要",
        "category": "python",
        "type": "question",
        "author": {
          "_id": "user_id",
          "name": "张三",
          "avatar": "avatar_url"
        },
        "tags": ["python", "学习"],
        "likes": 25,
        "comments": 8,
        "views": 156,
        "createdAt": "2024-03-XX",
        "lastActivity": "2024-03-XX"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50
    }
  }
}
```

### GET /community/posts/:id
获取帖子详情

**响应**:
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "如何学好Python？",
    "content": "帖子完整内容（支持Markdown）",
    "category": "python",
    "type": "question",
    "author": {
      "_id": "user_id",
      "name": "张三",
      "avatar": "avatar_url",
      "title": "Python开发者"
    },
    "tags": ["python", "学习"],
    "attachments": [
      {
        "name": "example.py",
        "url": "file_url",
        "type": "code"
      }
    ],
    "likes": 25,
    "isLiked": false,
    "comments": [
      {
        "_id": "comment_id",
        "content": "评论内容",
        "author": {
          "name": "李四",
          "avatar": "avatar_url"
        },
        "likes": 3,
        "createdAt": "2024-03-XX",
        "replies": []
      }
    ],
    "views": 156,
    "createdAt": "2024-03-XX",
    "updatedAt": "2024-03-XX"
  }
}
```

### POST /community/posts
创建帖子

**请求头**: 需要认证
**请求体** (multipart/form-data):
```json
{
  "title": "帖子标题",
  "content": "帖子内容",
  "category": "python",
  "type": "discussion",
  "tags": "[\"python\", \"学习\"]"
}
```

### PUT /community/posts/:id
更新帖子

**请求头**: 需要认证（仅作者或管理员）
**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "tags": ["python", "进阶"]
}
```

### DELETE /community/posts/:id
删除帖子

**请求头**: 需要认证（仅作者或管理员）

### POST /community/posts/:id/like
点赞帖子

**请求头**: 需要认证

### POST /community/posts/:id/comments
添加评论

**请求头**: 需要认证
**请求体**:
```json
{
  "content": "评论内容",
  "parentId": "parent_comment_id"  // 可选，用于回复评论
}
```

## 代码运行接口

### POST /code/run
执行代码

**请求头**: 需要认证
**请求体**:
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": ""
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "output": "Hello, World!\n",
    "error": "",
    "executionTime": 0.05,
    "memoryUsage": 1024
  }
}
```

### GET /code/templates
获取代码模板

**查询参数**:
- `language`: 编程语言
- `category`: 模板分类

**响应**:
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "_id": "template_id",
        "name": "Hello World",
        "description": "基础的Hello World示例",
        "language": "python",
        "code": "print('Hello, World!')",
        "category": "basics",
        "tags": ["基础", "入门"]
      }
    ]
  }
}
```

## 错误码说明

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | VALIDATION_ERROR | 请求参数验证失败 |
| 401 | UNAUTHORIZED | 未认证或token无效 |
| 403 | FORBIDDEN | 权限不足 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突 |
| 422 | UNPROCESSABLE_ENTITY | 数据格式正确但语义错误 |
| 429 | RATE_LIMIT_EXCEEDED | 请求频率超限 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

## 速率限制

为了保护服务器资源，API接口实行速率限制：

- **常规接口**: 每个IP每15分钟最多100个请求
- **代码执行接口**: 每个用户每分钟最多10次执行
- **文件上传接口**: 每个用户每小时最多20次上传

## 分页

所有列表接口都支持分页，使用以下参数：

- `page`: 当前页码（从1开始）
- `limit`: 每页项目数量（最大100）

分页响应格式：
```json
{
  "pagination": {
    "current": 1,
    "pages": 10,
    "total": 95,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## WebSocket 实时通信

平台支持WebSocket连接用于实时功能：

**连接地址**: `ws://localhost:5000`

**事件类型**:
- `notification`: 用户通知
- `comment`: 新评论通知
- `system`: 系统消息

**认证**: 连接时发送token进行认证
```javascript
socket.emit('authenticate', { token: 'your-jwt-token' });
```