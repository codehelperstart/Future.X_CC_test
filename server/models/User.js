const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符']
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  profile: {
    bio: {
      type: String,
      maxlength: [200, '个人简介最多200个字符']
    },
    skills: [{
      type: String,
      maxlength: 50
    }],
    level: {
      type: String,
      enum: ['初学者', '入门', '中级', '高级', '专家'],
      default: '初学者'
    },
    github: {
      type: String,
      match: [/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/, '请输入有效的GitHub链接']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, '请输入有效的网址']
    }
  },
  learningProgress: {
    completedCourses: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    currentCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date
    }
  },
  socialStats: {
    posts: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  preferences: {
    language: {
      type: String,
      enum: ['zh', 'en'],
      default: 'zh'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  registrationIP: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('followerCount').get(function() {
  return this.socialStats.followers.length;
});

userSchema.virtual('followingCount').get(function() {
  return this.socialStats.following.length;
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.registrationIP;
  return user;
};

userSchema.index({ email: 1, username: 1 });
userSchema.index({ 'learningProgress.totalPoints': -1 });

module.exports = mongoose.model('User', userSchema);