import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Search, 
  FileText, 
  Code, 
  Copy,
  Play,
  Star,
  BookOpen,
  Lightbulb
} from 'lucide-react';

const CodeTemplates = ({ templates, snippets, language, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('templates');

  const currentTemplates = templates?.[language] || {};
  const currentSnippets = snippets || {};

  // Filter templates based on search
  const filteredTemplates = Object.entries(currentTemplates).filter(([key, template]) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter snippets based on search
  const filteredSnippets = Object.entries(currentSnippets).reduce((acc, [category, snippetList]) => {
    const filtered = snippetList.filter(snippet =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const handleTemplateSelect = (template) => {
    onSelect(template.code);
  };

  const handleCopyCode = (code, event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(code);
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      html: '🌐',
      css: '🎨',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
    };
    return icons[lang] || '📄';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-700 p-6 border-b border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">代码模板库</h2>
                <p className="text-gray-300 text-sm">
                  选择 {getLanguageIcon(language)} {language.toUpperCase()} 的代码模板或代码片段
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模板或代码片段..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mt-4">
            <button
              onClick={() => setSelectedTab('templates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'templates'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              模板 ({Object.keys(currentTemplates).length})
            </button>
            <button
              onClick={() => setSelectedTab('snippets')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'snippets'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <Code className="h-4 w-4 inline mr-2" />
              代码片段 ({Object.keys(currentSnippets).length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Templates/Snippets List */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-600">
            {selectedTab === 'templates' ? (
              <div className="space-y-4">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>没有找到匹配的模板</p>
                  </div>
                ) : (
                  filteredTemplates.map(([key, template]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors border border-gray-600 hover:border-primary-500"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{template.title}</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleCopyCode(template.code, e)}
                            className="p-1 hover:bg-gray-500 rounded text-gray-400 hover:text-white transition-colors"
                            title="复制代码"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <Play className="h-4 w-4 text-primary-400" />
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-gray-600 px-2 py-1 rounded">
                          {language.toUpperCase()}
                        </span>
                        <span className="ml-2">点击使用此模板</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(filteredSnippets).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Code className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>没有找到匹配的代码片段</p>
                  </div>
                ) : (
                  Object.entries(filteredSnippets).map(([category, snippetList]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                        {category.replace('_', ' ').toUpperCase()}
                      </h3>
                      <div className="space-y-3">
                        {snippetList.map((snippet, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors border border-gray-600 hover:border-primary-500"
                            onClick={() => handleTemplateSelect(snippet.code)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white text-sm">{snippet.title}</h4>
                              <button
                                onClick={(e) => handleCopyCode(snippet.code, e)}
                                className="p-1 hover:bg-gray-500 rounded text-gray-400 hover:text-white transition-colors"
                                title="复制代码"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-gray-300 text-xs">{snippet.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 p-6 bg-gray-900">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                代码预览
              </h3>

              {filteredTemplates.length > 0 || Object.keys(filteredSnippets).length > 0 ? (
                <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                  <p className="text-gray-400 text-sm text-center py-8">
                    点击左侧的模板或代码片段查看预览
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Code className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <p className="mb-2">暂无可用的模板</p>
                    <p className="text-sm">切换到其他语言或调整搜索条件</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500 space-y-2">
                  <p className="font-medium">💡 使用技巧:</p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>点击模板直接插入到编辑器</li>
                    <li>使用复制按钮复制代码</li>
                    <li>可以搜索查找特定模板</li>
                    <li>支持多种编程语言</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              选择模板快速开始编程，提高开发效率
            </div>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              取消
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodeTemplates;