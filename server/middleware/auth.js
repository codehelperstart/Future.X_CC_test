const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，请提供有效的身份验证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '令牌无效或用户不存在'
      });
    }

    req.user = decoded;
    req.userDoc = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '令牌格式无效'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '令牌已过期，请重新登录'
      });
    }

    console.error('认证错误:', error);
    res.status(500).json({
      success: false,
      message: '身份验证失败'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userDoc.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '访问被拒绝，需要管理员权限'
    });
  }
  next();
};

const isModerator = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.userDoc.role)) {
    return res.status(403).json({
      success: false,
      message: '访问被拒绝，需要版主或管理员权限'
    });
  }
  next();
};

module.exports = { auth, isAdmin, isModerator };