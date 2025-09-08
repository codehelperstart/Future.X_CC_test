const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  codeExamples: [{
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    description: String,
    expectedOutput: String
  }],
  exercises: [{
    question: {
      type: String,
      required: true
    },
    starterCode: String,
    solution: String,
    hints: [String],
    difficulty: {
      type: String,
      enum: ['简单', '中等', '困难'],
      default: '简单'
    }
  }],
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  order: {
    type: Number,
    required: true
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '课程标题不能为空'],
    maxlength: [100, '课程标题最多100个字符']
  },
  description: {
    type: String,
    required: [true, '课程描述不能为空'],
    maxlength: [1000, '课程描述最多1000个字符']
  },
  thumbnail: {
    type: String,
    default: '/default-course.png'
  },
  category: {
    type: String,
    required: true,
    enum: [
      'AI基础',
      'Python编程',
      'JavaScript编程',
      '机器学习',
      '深度学习',
      '自然语言处理',
      '计算机视觉',
      '数据科学',
      'Web开发',
      '移动开发',
      '其他'
    ]
  },
  level: {
    type: String,
    required: true,
    enum: ['初学者', '入门', '中级', '高级']
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessons: [lessonSchema],
  prerequisites: [{
    type: String,
    maxlength: 100
  }],
  learningObjectives: [{
    type: String,
    maxlength: 200
  }],
  estimatedTime: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentStats: {
    enrolled: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['文档', '视频', '工具', '链接', '代码库']
    },
    url: String,
    description: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

courseSchema.virtual('completionRate').get(function() {
  if (this.enrollmentStats.enrolled === 0) return 0;
  return (this.enrollmentStats.completed / this.enrollmentStats.enrolled * 100).toFixed(1);
});

courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ 'enrollmentStats.averageRating': -1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);