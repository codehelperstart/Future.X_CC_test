const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth, isModerator } = require('../middleware/auth');

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['技术讨论', '学习心得', '项目展示', '求助问答', 'AI工具推荐', '职业发展', '资源分享', '其他']),
  query('sort').optional().isIn(['latest', 'popular', 'trending'])
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
    const { category, search, sort = 'latest', tags } = req.query;

    let query = { isDeleted: false };
    let sortOptions = {};

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    switch (sort) {
      case 'popular':
        sortOptions = { views: -1, likeCount: -1 };
        break;
      case 'trending':
        sortOptions = { lastActivity: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar profile.level')
      .populate('comments.author', 'username avatar')
      .select('-comments.replies -__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    const postsWithStats = posts.map(post => ({
      ...post,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.filter(c => !c.isDeleted).length || 0,
      bookmarkCount: post.bookmarks?.length || 0
    }));

    res.json({
      success: true,
      data: {
        posts: postsWithStats,
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
    console.error('获取帖子列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取帖子列表失败'
    });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingPosts = await Post.find({
      isDeleted: false,
      createdAt: { $gte: sevenDaysAgo }
    })
      .populate('author', 'username avatar profile.level')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      data: { posts: trendingPosts }
    });
  } catch (error) {
    console.error('获取热门帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '获取热门帖子失败'
    });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'username avatar profile')
      .populate('comments.author', 'username avatar profile.level')
      .populate('comments.replies.author', 'username avatar');

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    post.views += 1;
    await post.save();

    const postWithStats = {
      ...post.toObject(),
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length,
      commentCount: post.comments.filter(c => !c.isDeleted).length,
      bookmarkCount: post.bookmarks.length
    };

    res.json({
      success: true,
      data: { post: postWithStats }
    });
  } catch (error) {
    console.error('获取帖子详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取帖子详情失败'
    });
  }
});

router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('帖子标题不能为空')
    .isLength({ max: 200 })
    .withMessage('帖子标题最多200个字符'),
  body('content')
    .notEmpty()
    .withMessage('帖子内容不能为空')
    .isLength({ max: 10000 })
    .withMessage('帖子内容最多10000个字符'),
  body('category')
    .isIn(['技术讨论', '学习心得', '项目展示', '求助问答', 'AI工具推荐', '职业发展', '资源分享', '其他'])
    .withMessage('无效的帖子分类'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是数组格式')
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

    const { title, content, category, tags, codeBlocks, difficulty, status } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.userId,
      category,
      tags: tags || [],
      codeBlocks: codeBlocks || [],
      difficulty: difficulty || '入门',
      status: status || '讨论中'
    });

    await post.save();
    await post.populate('author', 'username avatar profile.level');

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'socialStats.posts': 1 }
    });

    res.status(201).json({
      success: true,
      message: '帖子发布成功',
      data: { post }
    });
  } catch (error) {
    console.error('创建帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '发布帖子失败'
    });
  }
});

router.put('/:postId', auth, [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('帖子标题最多200个字符'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('帖子内容最多10000个字符')
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

    const { postId } = req.params;
    const updates = req.body;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    if (post.author.toString() !== req.user.userId && req.userDoc.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权限编辑此帖子'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        post[key] = updates[key];
      }
    });

    await post.save();
    await post.populate('author', 'username avatar profile.level');

    res.json({
      success: true,
      message: '帖子更新成功',
      data: { post }
    });
  } catch (error) {
    console.error('更新帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '更新帖子失败'
    });
  }
});

router.post('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      if (hasDisliked) {
        post.dislikes.pull(userId);
      }
    }

    await post.save();

    res.json({
      success: true,
      message: hasLiked ? '已取消点赞' : '点赞成功',
      data: {
        liked: !hasLiked,
        likeCount: post.likes.length,
        dislikeCount: post.dislikes.length
      }
    });
  } catch (error) {
    console.error('点赞帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '操作失败'
    });
  }
});

router.post('/:postId/bookmark', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const hasBookmarked = post.bookmarks.includes(userId);

    if (hasBookmarked) {
      post.bookmarks.pull(userId);
    } else {
      post.bookmarks.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      message: hasBookmarked ? '已取消收藏' : '收藏成功',
      data: {
        bookmarked: !hasBookmarked,
        bookmarkCount: post.bookmarks.length
      }
    });
  } catch (error) {
    console.error('收藏帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '操作失败'
    });
  }
});

router.post('/:postId/comments', auth, [
  body('content')
    .notEmpty()
    .withMessage('评论内容不能为空')
    .isLength({ max: 1000 })
    .withMessage('评论内容最多1000个字符')
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

    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const comment = {
      author: req.user.userId,
      content,
      likes: [],
      replies: []
    };

    post.comments.push(comment);
    await post.save();

    await post.populate('comments.author', 'username avatar profile.level');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: '评论发布成功',
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({
      success: false,
      message: '发布评论失败'
    });
  }
});

router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    if (post.author.toString() !== req.user.userId && req.userDoc.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权限删除此帖子'
      });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = req.user.userId;

    await post.save();

    await User.findByIdAndUpdate(post.author, {
      $inc: { 'socialStats.posts': -1 }
    });

    res.json({
      success: true,
      message: '帖子删除成功'
    });
  } catch (error) {
    console.error('删除帖子错误:', error);
    res.status(500).json({
      success: false,
      message: '删除帖子失败'
    });
  }
});

module.exports = router;