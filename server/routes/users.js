const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('search').optional().isLength({ max: 50 }).withMessage('搜索关键词最多50个字符'),
  query('level').optional().isIn(['初学者', '入门', '中级', '高级', '专家']).withMessage('无效的技能级别')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '查询参数验证失败',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, level, sortBy = 'createdAt' } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } },
        { 'profile.skills': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (level) {
      query['profile.level'] = level;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'points':
        sortOptions = { 'learningProgress.totalPoints': -1 };
        break;
      case 'followers':
        sortOptions = { 'socialStats.followers': -1 };
        break;
      case 'posts':
        sortOptions = { 'socialStats.posts': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const users = await User.find(query)
      .select('-password -registrationIP -email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('learningProgress.currentCourse', 'title thumbnail')
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({ isActive: true })
      .select('username avatar profile.level learningProgress.totalPoints socialStats')
      .sort({ 'learningProgress.totalPoints': -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      data: {
        leaderboard: topUsers.map((user, index) => ({
          ...user,
          rank: index + 1
        }))
      }
    });
  } catch (error) {
    console.error('获取排行榜错误:', error);
    res.status(500).json({
      success: false,
      message: '获取排行榜失败'
    });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -registrationIP')
      .populate('learningProgress.completedCourses.courseId', 'title thumbnail category')
      .populate('learningProgress.currentCourse', 'title thumbnail progress')
      .populate('socialStats.followers', 'username avatar')
      .populate('socialStats.following', 'username avatar')
      .lean();

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const canViewPrivate = req.user && (req.user.userId === userId || req.userDoc.role === 'admin');

    if (!canViewPrivate) {
      delete user.email;
      delete user.preferences;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户详情失败'
    });
  }
});

router.post('/:userId/follow', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: '不能关注自己'
      });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isAlreadyFollowing = currentUser.socialStats.following.includes(userId);

    if (isAlreadyFollowing) {
      currentUser.socialStats.following.pull(userId);
      targetUser.socialStats.followers.pull(currentUserId);
      await Promise.all([currentUser.save(), targetUser.save()]);

      res.json({
        success: true,
        message: '已取消关注',
        data: { isFollowing: false }
      });
    } else {
      currentUser.socialStats.following.push(userId);
      targetUser.socialStats.followers.push(currentUserId);
      await Promise.all([currentUser.save(), targetUser.save()]);

      res.json({
        success: true,
        message: '关注成功',
        data: { isFollowing: true }
      });
    }
  } catch (error) {
    console.error('关注用户错误:', error);
    res.status(500).json({
      success: false,
      message: '操作失败'
    });
  }
});

router.get('/:userId/followers', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'socialStats.followers',
        select: 'username avatar profile.level learningProgress.totalPoints',
        options: {
          skip,
          limit,
          sort: { 'learningProgress.totalPoints': -1 }
        }
      });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const total = user.socialStats.followers.length;

    res.json({
      success: true,
      data: {
        followers: user.socialStats.followers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('获取关注者列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取关注者列表失败'
    });
  }
});

router.get('/:userId/following', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'socialStats.following',
        select: 'username avatar profile.level learningProgress.totalPoints',
        options: {
          skip,
          limit,
          sort: { 'learningProgress.totalPoints': -1 }
        }
      });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const total = user.socialStats.following.length;

    res.json({
      success: true,
      data: {
        following: user.socialStats.following,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('获取关注列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取关注列表失败'
    });
  }
});

router.put('/:userId/deactivate', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '用户已被停用',
      data: { user }
    });
  } catch (error) {
    console.error('停用用户错误:', error);
    res.status(500).json({
      success: false,
      message: '停用用户失败'
    });
  }
});

module.exports = router;