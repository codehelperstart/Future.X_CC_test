const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

const executeCode = async (language, code) => {
  return new Promise((resolve) => {
    try {
      let result = '';
      let error = '';
      
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          try {
            const originalLog = console.log;
            const logs = [];
            console.log = (...args) => {
              logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            };
            
            const func = new Function(code);
            const output = func();
            
            console.log = originalLog;
            
            result = logs.length > 0 ? logs.join('\n') : 
                     (output !== undefined ? String(output) : '代码执行完成');
          } catch (e) {
            error = `JavaScript执行错误: ${e.message}`;
          }
          break;
          
        case 'python':
        case 'py':
          result = '# Python代码模拟执行\n# 在实际部署时，需要集成Python解释器\nprint("Hello from Python!")\n# 输出: Hello from Python!';
          break;
          
        case 'html':
          result = `<!DOCTYPE html>
<html>
<head>
    <title>HTML预览</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
    </style>
</head>
<body>
${code}
</body>
</html>`;
          break;
          
        case 'css':
          result = `/* CSS样式预览 */
${code}

/* 样式已应用到HTML元素 */`;
          break;
          
        default:
          error = `不支持的编程语言: ${language}`;
      }
      
      resolve({
        success: !error,
        output: result,
        error: error || null,
        language,
        executionTime: Math.floor(Math.random() * 100) + 'ms'
      });
    } catch (e) {
      resolve({
        success: false,
        output: '',
        error: `执行错误: ${e.message}`,
        language,
        executionTime: '0ms'
      });
    }
  });
};

router.post('/execute', [
  body('code')
    .notEmpty()
    .withMessage('代码不能为空')
    .isLength({ max: 50000 })
    .withMessage('代码长度不能超过50000个字符'),
  body('language')
    .notEmpty()
    .withMessage('编程语言不能为空')
    .isIn(['javascript', 'js', 'python', 'py', 'html', 'css', 'java', 'cpp', 'c'])
    .withMessage('不支持的编程语言')
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

    const { code, language, input = '' } = req.body;

    const startTime = Date.now();
    const result = await executeCode(language, code, input);
    const executionTime = Date.now() - startTime;

    result.executionTime = `${executionTime}ms`;

    res.json({
      success: true,
      message: '代码执行完成',
      data: result
    });
  } catch (error) {
    console.error('代码执行错误:', error);
    res.status(500).json({
      success: false,
      message: '代码执行失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/templates', (req, res) => {
  try {
    const templates = {
      javascript: {
        hello_world: {
          title: '你好，世界！',
          description: '经典的Hello World程序',
          code: `// JavaScript Hello World
console.log("Hello, World!");
console.log("欢迎来到AI编程学习平台！");

// 计算并输出当前时间
const now = new Date();
console.log("当前时间:", now.toLocaleString());`
        },
        variables: {
          title: '变量和数据类型',
          description: '学习JavaScript的基本变量和数据类型',
          code: `// JavaScript变量和数据类型示例

// 字符串
let name = "AI学习者";
const platform = "AI编程平台";

// 数字
let age = 25;
const pi = 3.14159;

// 布尔值
let isLearning = true;
let hasExperience = false;

// 数组
const skills = ["JavaScript", "Python", "AI"];
const numbers = [1, 2, 3, 4, 5];

// 对象
const user = {
  name: name,
  age: age,
  skills: skills,
  isActive: true
};

// 输出结果
console.log("用户信息:", user);
console.log("技能列表:", skills.join(", "));
console.log("学习状态:", isLearning ? "正在学习" : "未在学习");`
        },
        functions: {
          title: '函数基础',
          description: '学习如何定义和使用函数',
          code: `// JavaScript函数示例

// 普通函数
function greet(name) {
  return "你好, " + name + "!";
}

// 箭头函数
const add = (a, b) => a + b;
const multiply = (x, y) => x * y;

// 高阶函数
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evenNumbers = numbers.filter(n => n % 2 === 0);

// 递归函数
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 调用函数并输出结果
console.log(greet("AI学习者"));
console.log("2 + 3 =", add(2, 3));
console.log("4 * 5 =", multiply(4, 5));
console.log("原数组:", numbers);
console.log("翻倍后:", doubled);
console.log("偶数:", evenNumbers);
console.log("5的阶乘:", factorial(5));`
        },
        async_await: {
          title: '异步编程',
          description: '学习Promise和async/await',
          code: `// JavaScript异步编程示例

// 模拟API调用
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: "AI学习者" + userId,
          level: "中级",
          points: Math.floor(Math.random() * 1000)
        });
      } else {
        reject(new Error("无效的用户ID"));
      }
    }, 1000);
  });
}

// 使用async/await
async function getUserProfile(userId) {
  try {
    console.log("正在获取用户数据...");
    const user = await fetchUserData(userId);
    console.log("用户数据获取成功:", user);
    return user;
  } catch (error) {
    console.error("获取用户数据失败:", error.message);
    return null;
  }
}

// 执行异步操作
getUserProfile(1).then(user => {
  if (user) {
    console.log("用户级别:", user.level);
    console.log("积分:", user.points);
  }
});

console.log("这行会先执行，因为上面的操作是异步的");`
        }
      },
      python: {
        hello_world: {
          title: 'Python Hello World',
          description: 'Python版本的Hello World',
          code: `# Python Hello World
print("Hello, World!")
print("欢迎来到AI编程学习平台！")

# 变量和基本操作
name = "AI学习者"
age = 25
print(f"姓名: {name}, 年龄: {age}")

# 列表操作
skills = ["Python", "机器学习", "数据科学"]
print("技能列表:", ", ".join(skills))

# 简单计算
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
average = total / len(numbers)
print(f"数字总和: {total}, 平均值: {average}")`
        },
        data_structures: {
          title: 'Python数据结构',
          description: '学习Python的基本数据结构',
          code: `# Python数据结构示例

# 列表 (List)
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print("水果列表:", fruits)
fruits.append("草莓")
print("添加草莓后:", fruits)

# 字典 (Dictionary)
student = {
    "name": "小明",
    "age": 20,
    "major": "计算机科学",
    "gpa": 3.8
}
print("学生信息:", student)
student["year"] = "大三"
print("更新后:", student)

# 集合 (Set)
programming_languages = {"Python", "JavaScript", "Java", "C++"}
ai_languages = {"Python", "R", "Julia", "MATLAB"}
print("编程语言:", programming_languages)
print("AI语言:", ai_languages)
print("共同语言:", programming_languages & ai_languages)

# 元组 (Tuple)
coordinates = (10, 20)
rgb_color = (255, 0, 128)
print("坐标:", coordinates)
print("RGB颜色:", rgb_color)`
        },
        functions: {
          title: 'Python函数',
          description: '学习Python函数的定义和使用',
          code: `# Python函数示例

# 基本函数
def greet(name, language="中文"):
    if language == "中文":
        return f"你好，{name}！"
    else:
        return f"Hello, {name}!"

# 带默认参数的函数
def calculate_grade(score, bonus=0):
    total = score + bonus
    if total >= 90:
        return "A"
    elif total >= 80:
        return "B"
    elif total >= 70:
        return "C"
    else:
        return "D"

# 可变参数函数
def calculate_average(*numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# Lambda函数
square = lambda x: x ** 2
is_even = lambda x: x % 2 == 0

# 使用函数
print(greet("AI学习者"))
print(greet("AI Learner", "English"))
print("成绩等级:", calculate_grade(85, 5))
print("平均分:", calculate_average(90, 85, 92, 78))
print("5的平方:", square(5))
print("4是偶数吗?", is_even(4))

# 列表推导式
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [square(n) for n in numbers]
even_numbers = [n for n in numbers if is_even(n)]
print("平方数:", squares)
print("偶数:", even_numbers)`
        }
      },
      html: {
        basic_page: {
          title: '基础HTML页面',
          description: '创建一个基本的HTML页面',
          code: `<h1>🤖 AI编程学习平台</h1>

<p>欢迎来到AI编程学习的世界！在这里你可以：</p>

<ul>
    <li>学习各种编程语言</li>
    <li>实践AI相关项目</li>
    <li>与其他学习者交流</li>
    <li>获得个性化学习建议</li>
</ul>

<h2>🔥 热门课程</h2>
<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
    <h3>Python AI基础</h3>
    <p>从零开始学习Python和人工智能基础知识</p>
    <button style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px;">开始学习</button>
</div>

<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
    <h3>机器学习入门</h3>
    <p>掌握机器学习的核心概念和常用算法</p>
    <button style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px;">开始学习</button>
</div>`
        },
        form_example: {
          title: 'HTML表单示例',
          description: '学习HTML表单的创建',
          code: `<h2>📝 用户注册表单</h2>

<form style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <div style="margin-bottom: 15px;">
        <label for="username" style="display: block; margin-bottom: 5px;">用户名:</label>
        <input type="text" id="username" name="username" required 
               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    </div>

    <div style="margin-bottom: 15px;">
        <label for="email" style="display: block; margin-bottom: 5px;">邮箱:</label>
        <input type="email" id="email" name="email" required
               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    </div>

    <div style="margin-bottom: 15px;">
        <label for="level" style="display: block; margin-bottom: 5px;">编程水平:</label>
        <select id="level" name="level" 
                style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="beginner">初学者</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
        </select>
    </div>

    <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">感兴趣的领域:</label>
        <label><input type="checkbox" name="interests" value="ai"> 人工智能</label><br>
        <label><input type="checkbox" name="interests" value="web"> Web开发</label><br>
        <label><input type="checkbox" name="interests" value="mobile"> 移动开发</label><br>
        <label><input type="checkbox" name="interests" value="data"> 数据科学</label>
    </div>

    <button type="submit" style="background: #007bff; color: white; border: none; 
                                  padding: 10px 20px; border-radius: 4px; cursor: pointer;">
        注册
    </button>
</form>`
        }
      },
      css: {
        basic_styling: {
          title: 'CSS基础样式',
          description: '学习CSS的基本样式设置',
          code: `/* CSS基础样式示例 */

/* 全局样式 */
body {
    font-family: 'Arial', 'Microsoft YaHei', sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
}

/* 标题样式 */
h1 {
    color: #2c3e50;
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

h2 {
    color: #34495e;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
}

/* 卡片样式 */
.card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 25px;
    margin: 20px 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* 按钮样式 */
.btn {
    display: inline-block;
    padding: 12px 24px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.btn:hover {
    background: #2980b9;
    transform: scale(1.05);
}

.btn-success {
    background: #27ae60;
}

.btn-success:hover {
    background: #229954;
}

/* 响应式设计 */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    h1 {
        font-size: 2em;
    }
    
    .card {
        padding: 15px;
    }
}`
        },
        flexbox_layout: {
          title: 'Flexbox布局',
          description: '学习使用Flexbox进行页面布局',
          code: `/* Flexbox布局示例 */

.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

/* 头部导航 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #2c3e50;
    color: white;
}

.nav {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
}

.nav-item {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.3s;
}

.nav-item:hover {
    background: rgba(255,255,255,0.2);
}

/* 主要内容区 */
.main {
    display: flex;
    flex: 1;
}

.sidebar {
    flex: 0 0 250px;
    background: #f8f9fa;
    padding: 2rem;
    border-right: 1px solid #dee2e6;
}

.content {
    flex: 1;
    padding: 2rem;
}

/* 课程网格 */
.course-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 2rem;
}

.course-card {
    flex: 1 1 calc(33.333% - 1rem);
    min-width: 280px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.course-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem;
    text-align: center;
}

.course-body {
    padding: 1.5rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .main {
        flex-direction: column;
    }
    
    .sidebar {
        flex: none;
    }
    
    .course-card {
        flex: 1 1 100%;
    }
    
    .header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav {
        flex-direction: column;
        text-align: center;
    }
}`
        }
      }
    };

    res.json({
      success: true,
      data: { templates }
    });
  } catch (error) {
    console.error('获取代码模板错误:', error);
    res.status(500).json({
      success: false,
      message: '获取代码模板失败'
    });
  }
});

router.get('/snippets', async (req, res) => {
  try {
    const { category = 'all', language } = req.query;

    const snippets = {
      ai_examples: [
        {
          id: 'linear_regression',
          title: '线性回归示例',
          description: '使用Python实现简单的线性回归',
          language: 'python',
          code: `import numpy as np
import matplotlib.pyplot as plt

# 生成示例数据
np.random.seed(42)
X = np.random.randn(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# 线性回归实现
def linear_regression(X, y):
    # 添加偏置项
    X_b = np.c_[np.ones((100, 1)), X]
    # 正规方程求解
    theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
    return theta

# 训练模型
theta = linear_regression(X, y)
print(f"参数: 偏置={theta[0][0]:.2f}, 斜率={theta[1][0]:.2f}")

# 预测
X_new = np.array([[-2], [2]])
X_new_b = np.c_[np.ones((2, 1)), X_new]
y_predict = X_new_b.dot(theta)

print(f"预测结果: {y_predict.flatten()}")`
        },
        {
          id: 'neural_network',
          title: '简单神经网络',
          description: '使用JavaScript实现简单的神经网络',
          language: 'javascript',
          code: `// 简单的神经网络实现
class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.weights1 = this.randomMatrix(inputSize, hiddenSize);
        this.weights2 = this.randomMatrix(hiddenSize, outputSize);
    }
    
    randomMatrix(rows, cols) {
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => Math.random() * 2 - 1)
        );
    }
    
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    sigmoidDerivative(x) {
        return x * (1 - x);
    }
    
    matrixMultiply(a, b) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < b.length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }
    
    predict(input) {
        // 前向传播
        const hidden = this.matrixMultiply([input], this.weights1)[0]
            .map(x => this.sigmoid(x));
        const output = this.matrixMultiply([hidden], this.weights2)[0]
            .map(x => this.sigmoid(x));
        return output;
    }
}

// 使用示例
const nn = new NeuralNetwork(2, 4, 1);

// 测试XOR问题
const testData = [
    [0, 0], [0, 1], [1, 0], [1, 1]
];

console.log("XOR神经网络测试:");
testData.forEach(input => {
    const output = nn.predict(input);
    console.log(\`输入: [\${input.join(', ')}] -> 输出: \${output[0].toFixed(4)}\`);
});`
        }
      ],
      web_development: [
        {
          id: 'react_component',
          title: 'React组件示例',
          description: '创建一个React学习卡片组件',
          language: 'javascript',
          code: `// React学习卡片组件
import React, { useState } from 'react';

const LearningCard = ({ course }) => {
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleEnroll = () => {
        setIsEnrolled(true);
        console.log(\`已报名课程: \${course.title}\`);
    };

    const updateProgress = (newProgress) => {
        setProgress(Math.min(100, Math.max(0, newProgress)));
    };

    return (
        <div className="learning-card">
            <div className="card-header">
                <img src={course.thumbnail} alt={course.title} />
                <div className="difficulty-badge">
                    {course.level}
                </div>
            </div>
            
            <div className="card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                
                <div className="course-stats">
                    <span>👥 {course.enrolled} 人学习</span>
                    <span>⭐ {course.rating}</span>
                    <span>⏱️ {course.duration}小时</span>
                </div>

                {isEnrolled ? (
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: \`\${progress}%\` }}
                            />
                        </div>
                        <div className="progress-controls">
                            <button onClick={() => updateProgress(progress + 10)}>
                                继续学习
                            </button>
                            <span>{progress}% 完成</span>
                        </div>
                    </div>
                ) : (
                    <button 
                        className="enroll-button"
                        onClick={handleEnroll}
                    >
                        开始学习
                    </button>
                )}
            </div>
        </div>
    );
};

// 使用示例
const sampleCourse = {
    title: "Python AI基础",
    description: "从零开始学习Python和人工智能",
    thumbnail: "/course-thumb.jpg",
    level: "初学者",
    enrolled: 1250,
    rating: 4.8,
    duration: 20
};

// 在应用中使用
function App() {
    return (
        <div className="app">
            <h1>AI编程学习平台</h1>
            <LearningCard course={sampleCourse} />
        </div>
    );
}

export default App;`
        }
      ]
    };

    let filteredSnippets = {};

    if (category === 'all') {
      filteredSnippets = snippets;
    } else if (snippets[category]) {
      filteredSnippets[category] = snippets[category];
    }

    if (language) {
      Object.keys(filteredSnippets).forEach(cat => {
        filteredSnippets[cat] = filteredSnippets[cat].filter(
          snippet => snippet.language === language
        );
      });
    }

    res.json({
      success: true,
      data: { snippets: filteredSnippets }
    });
  } catch (error) {
    console.error('获取代码片段错误:', error);
    res.status(500).json({
      success: false,
      message: '获取代码片段失败'
    });
  }
});

module.exports = router;