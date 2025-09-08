import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Play, Download, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const CodeBlock = ({ code, language = 'javascript', description, theme = 'dark' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('代码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('复制失败');
    }
  };

  const handleDownload = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
    };

    const extension = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('代码文件已下载');
  };

  const handleRun = () => {
    // This could integrate with the code editor or open in a new tab
    toast.info('功能开发中...');
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
      typescript: '🔷',
      jsx: '⚛️',
      tsx: '⚛️',
    };
    return icons[lang] || '📄';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {getLanguageIcon(language)} {language.toUpperCase()}
            </span>
            {description && (
              <span className="text-sm text-gray-500">
                - {description}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                copied ? 'text-green-600' : 'text-gray-600'
              }`}
              title="复制代码"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
              title="下载文件"
            >
              <Download className="h-4 w-4" />
            </button>
            
            {(language === 'javascript' || language === 'python' || language === 'html') && (
              <button
                onClick={handleRun}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="运行代码"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '14px',
            lineHeight: '1.5',
            background: theme === 'dark' ? '#1e1e1e' : '#fafafa',
          }}
          showLineNumbers={code.split('\n').length > 5}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>

        {/* Copy feedback */}
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium"
          >
            已复制!
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {code.split('\n').length} 行, {code.length} 字符
          </span>
          <div className="flex items-center space-x-4">
            <span>点击复制按钮复制代码</span>
            {(language === 'javascript' || language === 'python' || language === 'html') && (
              <span>点击运行按钮在编辑器中打开</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeBlock;