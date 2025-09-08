const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
    .withMessage('用户名只能包含字母、数字、下划线和中文'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少需要6个字符')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('密码必须包含至少一个字母和一个数字')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? '邮箱已被注册' : '用户名已被占用'
      });
    }

    const user = new User({
      username,
      email,
      password,
      registrationIP: req.ip,
      lastLogin: new Date()
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '注册成功！欢迎加入AI编程学习平台',
      data: {
        token,
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/login', [
  body('login')
    .notEmpty()
    .withMessage('请输入用户名或邮箱'),
  body('password')
    .notEmpty()
    .withMessage('请输入密码')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '登录成功！',
      data: {
        token,
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: '已安全退出登录'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '退出登录失败'
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('learningProgress.completedCourses.courseId', 'title thumbnail')
      .populate('learningProgress.currentCourse', 'title thumbnail progress');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

router.put('/profile', auth, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名必须在3-20个字符之间'),
  body('profile.bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('个人简介最多200个字符'),
  body('profile.skills')
    .optional()
    .isArray()
    .withMessage('技能必须是数组格式'),
  body('profile.github')
    .optional()
    .matches(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/)
    .withMessage('请输入有效的GitHub链接')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const updates = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    if (updates.username && updates.username !== user.username) {
      const existingUser = await User.findOne({ username: updates.username });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '用户名已被占用'
        });
      }
    }

    Object.keys(updates).forEach(key => {
      if (key === 'profile') {
        Object.keys(updates.profile).forEach(profileKey => {
          user.profile[profileKey] = updates.profile[profileKey];
        });
      } else if (key === 'preferences') {
        Object.keys(updates.preferences).forEach(prefKey => {
          user.preferences[prefKey] = updates.preferences[prefKey];
        });
      } else {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: '个人资料更新成功',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('更新个人资料错误:', error);
    res.status(500).json({
      success: false,
      message: '更新个人资料失败'
    });
  }
});

router.post('/change-password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('请输入当前密码'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少需要6个字符')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('新密码必须包含至少一个字母和一个数字')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '当前密码错误'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败'
    });
  }
});

module.exports = router;