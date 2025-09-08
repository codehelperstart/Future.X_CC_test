const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, '评论内容不能为空'],
    maxlength: [1000, '评论内容最多1000个字符']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '帖子标题不能为空'],
    maxlength: [200, '帖子标题最多200个字符'],
    trim: true
  },
  content: {
    type: String,
    required: [true, '帖子内容不能为空'],
    maxlength: [10000, '帖子内容最多10000个字符']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      '技术讨论',
      '学习心得',
      '项目展示',
      '求助问答',
      'AI工具推荐',
      '职业发展',
      '资源分享',
      '其他'
    ]
  },
  tags: [{
    type: String,
    maxlength: 30
  }],
  codeBlocks: [{
    language: {
      type: String,
      default: 'javascript'
    },
    code: {
      type: String,
      required: true
    },
    description: String
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  difficulty: {
    type: String,
    enum: ['入门', '初级', '中级', '高级', '专家'],
    default: '入门'
  },
  status: {
    type: String,
    enum: ['待解决', '已解决', '讨论中', '已关闭'],
    default: '讨论中'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => !comment.isDeleted).length;
});

postSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks.length;
});

postSchema.virtual('score').get(function() {
  return this.likes.length - this.dislikes.length;
});

postSchema.pre('save', function(next) {
  if (this.isModified('comments') || this.isModified('likes') || this.isModified('dislikes')) {
    this.lastActivity = new Date();
  }
  next();
});

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ lastActivity: -1 });
postSchema.index({ views: -1 });

module.exports = mongoose.model('Post', postSchema);