const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['AI基础', 'Python编程', 'JavaScript编程', '机器学习', '深度学习', '自然语言处理', '计算机视觉', '数据科学', 'Web开发', '移动开发', '其他']),
  query('level').optional().isIn(['初学者', '入门', '中级', '高级']),
  query('sort').optional().isIn(['latest', 'popular', 'rating', 'difficulty'])
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
    const { category, level, search, sort = 'latest', isPremium } = req.query;

    let query = { isPublished: true };
    let sortOptions = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (search) {
      query.$text = { $search: search };
    }

    switch (sort) {
      case 'popular':
        sortOptions = { 'enrollmentStats.enrolled': -1 };
        break;
      case 'rating':
        sortOptions = { 'enrollmentStats.averageRating': -1 };
        break;
      case 'difficulty':
        sortOptions = { difficulty: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'username avatar profile.level')
      .select('-lessons.exercises.solution -lessons.codeExamples.solution')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: {
        courses,
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
    console.error('获取课程列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取课程列表失败'
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const featuredCourses = await Course.find({
      isPublished: true,
      'enrollmentStats.averageRating': { $gte: 4.0 }
    })
      .populate('instructor', 'username avatar')
      .sort({ 'enrollmentStats.enrolled': -1 })
      .limit(8)
      .select('-lessons.exercises.solution')
      .lean();

    res.json({
      success: true,
      data: { courses: featuredCourses }
    });
  } catch (error) {
    console.error('获取推荐课程错误:', error);
    res.status(500).json({
      success: false,
      message: '获取推荐课程失败'
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$enrollmentStats.averageRating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('获取课程分类错误:', error);
    res.status(500).json({
      success: false,
      message: '获取课程分类失败'
    });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findById(courseId)
      .populate('instructor', 'username avatar profile')
      .populate('reviews.user', 'username avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }

    if (!course.isPublished && (!req.user || req.user.userId !== course.instructor._id.toString())) {
      return res.status(403).json({
        success: false,
        message: '课程未发布或无权限访问'
      });
    }

    let courseData = course.toObject();

    if (!req.user || (req.user.userId !== course.instructor._id.toString() && req.userDoc.role !== 'admin')) {
      courseData.lessons = courseData.lessons.map(lesson => ({
        ...lesson,
        exercises: lesson.exercises.map(exercise => ({
          ...exercise,
          solution: undefined
        }))
      }));
    }

    res.json({
      success: true,
      data: { course: courseData }
    });
  } catch (error) {
    console.error('获取课程详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取课程详情失败'
    });
  }
});

router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('课程标题不能为空')
    .isLength({ max: 100 })
    .withMessage('课程标题最多100个字符'),
  body('description')
    .notEmpty()
    .withMessage('课程描述不能为空')
    .isLength({ max: 1000 })
    .withMessage('课程描述最多1000个字符'),
  body('category')
    .isIn(['AI基础', 'Python编程', 'JavaScript编程', '机器学习', '深度学习', '自然语言处理', '计算机视觉', '数据科学', 'Web开发', '移动开发', '其他'])
    .withMessage('无效的课程分类'),
  body('level')
    .isIn(['初学者', '入门', '中级', '高级'])
    .withMessage('无效的课程级别'),
  body('estimatedTime')
    .isInt({ min: 1 })
    .withMessage('预计时长必须是正整数')
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

    const courseData = {
      ...req.body,
      instructor: req.user.userId
    };

    const course = new Course(courseData);
    await course.save();
    await course.populate('instructor', 'username avatar profile.level');

    res.status(201).json({
      success: true,
      message: '课程创建成功',
      data: { course }
    });
  } catch (error) {
    console.error('创建课程错误:', error);
    res.status(500).json({
      success: false,
      message: '创建课程失败'
    });
  }
});

router.put('/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }

    if (course.instructor.toString() !== req.user.userId && req.userDoc.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权限编辑此课程'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'instructor') {
        course[key] = updates[key];
      }
    });

    await course.save();
    await course.populate('instructor', 'username avatar profile.level');

    res.json({
      success: true,
      message: '课程更新成功',
      data: { course }
    });
  } catch (error) {
    console.error('更新课程错误:', error);
    res.status(500).json({
      success: false,
      message: '更新课程失败'
    });
  }
});

router.post('/:courseId/enroll', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: '课程不存在或未发布'
      });
    }

    const alreadyEnrolled = user.learningProgress.completedCourses
      .some(completed => completed.courseId.toString() === courseId) ||
      user.learningProgress.currentCourse?.toString() === courseId;

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: '已经报名了此课程'
      });
    }

    if (course.isPremium && course.price > 0) {
      return res.status(402).json({
        success: false,
        message: '这是付费课程，请先完成支付'
      });
    }

    user.learningProgress.currentCourse = courseId;
    course.enrollmentStats.enrolled += 1;

    await Promise.all([user.save(), course.save()]);

    res.json({
      success: true,
      message: '课程报名成功！开始你的学习之旅吧',
      data: {
        courseId,
        enrolledAt: new Date()
      }
    });
  } catch (error) {
    console.error('报名课程错误:', error);
    res.status(500).json({
      success: false,
      message: '报名课程失败'
    });
  }
});

router.post('/:courseId/complete', auth, [
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('分数必须在0-100之间')
], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { score = 100 } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }

    const alreadyCompleted = user.learningProgress.completedCourses
      .some(completed => completed.courseId.toString() === courseId);

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: '已经完成了此课程'
      });
    }

    user.learningProgress.completedCourses.push({
      courseId,
      score,
      completedAt: new Date()
    });

    if (user.learningProgress.currentCourse?.toString() === courseId) {
      user.learningProgress.currentCourse = null;
    }

    const points = Math.floor(score * course.difficulty * 10);
    user.learningProgress.totalPoints += points;

    course.enrollmentStats.completed += 1;

    await Promise.all([user.save(), course.save()]);

    res.json({
      success: true,
      message: `恭喜完成课程！获得 ${points} 积分`,
      data: {
        courseId,
        score,
        pointsEarned: points,
        totalPoints: user.learningProgress.totalPoints
      }
    });
  } catch (error) {
    console.error('完成课程错误:', error);
    res.status(500).json({
      success: false,
      message: '完成课程失败'
    });
  }
});

router.post('/:courseId/review', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('评分必须在1-5之间'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('评论最多500个字符')
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

    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }

    const existingReview = course.reviews.find(
      review => review.user.toString() === userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      course.reviews.push({
        user: userId,
        rating,
        comment
      });
    }

    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.enrollmentStats.averageRating = totalRating / course.reviews.length;
    course.enrollmentStats.totalRatings = course.reviews.length;

    await course.save();
    await course.populate('reviews.user', 'username avatar');

    res.json({
      success: true,
      message: '课程评价成功',
      data: {
        review: course.reviews.find(r => r.user._id.toString() === userId),
        averageRating: course.enrollmentStats.averageRating
      }
    });
  } catch (error) {
    console.error('评价课程错误:', error);
    res.status(500).json({
      success: false,
      message: '评价课程失败'
    });
  }
});

module.exports = router;