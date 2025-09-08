import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from 'react-query';
import { 
  Save,
  Eye,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Hash,
  AlertCircle,
  X,
  Plus,
  BookOpen
} from 'lucide-react';
import { communityAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    type: 'discussion', // discussion, question, tutorial, project
    codeSnippets: [],
    attachments: []
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'postCategories',
    communityAPI.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Create post mutation
  const createPostMutation = useMutation(
    (postData) => communityAPI.createPost(postData),
    {
      onSuccess: (response) => {
        toast.success('发布成功！');
        navigate(`/community/posts/${response.data._id}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '发布失败，请重试');
      }
    }
  );

  const categories = categoriesData?.data?.categories || [
    { id: 'general', name: '综合讨论' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'machine-learning', name: '机器学习' },
    { id: 'deep-learning', name: '深度学习' },
    { id: 'data-science', name: '数据科学' },
    { id: 'projects', name: '项目展示' },
    { id: 'career', name: '职业发展' },
  ];

  const postTypes = [
    { id: 'discussion', name: '讨论', icon: '💬', description: '分享想法和观点' },
    { id: 'question', name: '提问', icon: '❓', description: '寻求帮助和解答' },
    { id: 'tutorial', name: '教程', icon: '📚', description: '分享学习资源' },
    { id: 'project', name: '项目', icon: '🚀', description: '展示作品和项目' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.querySelector('textarea[name="content"]');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertText = '';
    switch (syntax) {
      case 'bold':
        insertText = `**${selectedText}**`;
        break;
      case 'italic':
        insertText = `*${selectedText}*`;
        break;
      case 'code':
        insertText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText}\n\`\`\`` 
          : `\`${selectedText}\``;
        break;
      case 'link':
        insertText = `[${selectedText}](url)`;
        break;
      case 'list':
        insertText = `- ${selectedText}`;
        break;
      case 'heading':
        insertText = `## ${selectedText}`;
        break;
      default:
        break;
    }
    
    const newContent = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 0);
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isDocument = ['text/plain', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidSize) {
        toast.error(`文件 ${file.name} 超过10MB限制`);
        return false;
      }
      
      return isImage || isDocument;
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles]
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('请先登录');
      navigate('/login');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('请输入标题');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('请输入内容');
      return;
    }
    
    if (!formData.category) {
      toast.error('请选择分类');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'tags') {
        submitData.append('tags', JSON.stringify(formData.tags));
      } else if (key === 'attachments') {
        formData.attachments.forEach(file => {
          submitData.append('attachments', file);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    createPostMutation.mutate(submitData);
  };

  const renderPreview = () => {
    return (
      <div className="prose prose-gray max-w-none">
        <h1>{formData.title || '标题预览'}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
            {categories.find(c => c.id === formData.category)?.name || '未选择分类'}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {postTypes.find(t => t.id === formData.type)?.name || '讨论'}
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ 
          __html: formData.content.replace(/\n/g, '<br>') || '内容预览'
        }} />
        {formData.tags.length > 0 && (
          <div className="mt-4">
            <h4>标签:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">创建新帖子</h1>
                  <p className="text-gray-600 mt-1">分享你的想法、问题或项目</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {isPreview ? '编辑' : '预览'}
                  </button>
                  <button
                    onClick={() => navigate('/community')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {!isPreview ? (
                <div className="space-y-6">
                  {/* Post Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      帖子类型
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {postTypes.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            formData.type === type.id
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      标题 *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="输入一个吸引人的标题..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      分类 *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">选择分类</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="content" className="text-sm font-medium text-gray-700">
                        内容 *
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('bold')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="加粗"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('italic')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="斜体"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('code')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="代码"
                        >
                          <Code className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('link')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="链接"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('list')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="列表"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('heading')}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded"
                          title="标题"
                        >
                          <Hash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="分享你的想法、问题或经验...&#10;&#10;支持 Markdown 语法：&#10;**加粗文本**&#10;*斜体文本*&#10;`代码`&#10;```代码块```&#10;- 列表项"
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      支持 Markdown 语法。字数: {formData.content.length}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签 (最多5个)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-primary-500 hover:text-primary-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入标签并按回车"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={formData.tags.length >= 5}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={formData.tags.length >= 5 || !currentTag.trim()}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      附件 (可选)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOver
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        拖拽文件到此处或{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          点击选择文件
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        支持图片、文档，最大10MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.txt,.pdf"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>
                    
                    {/* Attachments Preview */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="min-h-96">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">预览</h2>
                  {renderPreview()}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>发布前请仔细检查内容</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/community')}
                    className="btn btn-outline"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={createPostMutation.isLoading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {createPostMutation.isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    发布帖子
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePostPage;