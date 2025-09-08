import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Save, 
  Download, 
  Upload,
  Settings,
  Maximize2,
  Minimize2,
  Copy,
  RotateCcw,
  FileText,
  Terminal,
  Lightbulb,
  Share
} from 'lucide-react';
import { codeAPI } from '../../services/api';
import { useUIStore } from '../../stores/uiStore';
import toast from 'react-hot-toast';
import CodeTemplates from './components/CodeTemplates';
import CodeOutput from './components/CodeOutput';
import CodeSettings from './components/CodeSettings';

const CodeEditorPage = () => {
  const { theme } = useUIStore();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Editor settings
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    theme: theme === 'dark' ? 'vs-dark' : 'vs',
    minimap: true,
    wordWrap: 'off',
    lineNumbers: 'on',
    formatOnType: true,
    autoClosingBrackets: 'always',
  });

  // Load templates and snippets
  const { data: templatesData } = useQuery(
    'codeTemplates',
    codeAPI.getTemplates,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const { data: snippetsData } = useQuery(
    ['codeSnippets', language],
    () => codeAPI.getSnippets({ language }),
    {
      staleTime: 10 * 60 * 1000,
      enabled: !!language,
    }
  );

  // Execute code mutation
  const executeCodeMutation = useMutation(codeAPI.executeCode, {
    onSuccess: (response) => {
      setOutput(response.data);
      setIsRunning(false);
      if (!response.data.success) {
        toast.error('代码执行失败');
      }
    },
    onError: (error) => {
      setIsRunning(false);
      toast.error('代码执行失败');
      setOutput({
        success: false,
        error: error.message || '执行错误',
        output: '',
      });
    },
  });

  // Initialize with default code
  useEffect(() => {
    if (templatesData?.data?.templates?.[language]?.hello_world) {
      const template = templatesData.data.templates[language].hello_world;
      setCode(template.code);
    }
  }, [language, templatesData]);

  // Save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`code_editor_${language}`);
    if (saved && !code) {
      setCode(saved);
    }
  }, [language]);

  useEffect(() => {
    if (code) {
      localStorage.setItem(`code_editor_${language}`, code);
    }
  }, [code, language]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Add custom shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveCode();
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('请先编写代码');
      return;
    }

    setIsRunning(true);
    setOutput(null);
    
    executeCodeMutation.mutate({
      code,
      language,
      input: '', // Could add input support later
    });
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${getFileExtension(language)}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('代码已保存');
  };

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        toast.success('文件加载成功');
      };
      reader.readAsText(file);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('代码已复制到剪贴板');
  };

  const handleShareCode = () => {
    const shareData = {
      title: 'AI编程学习平台 - 代码分享',
      text: code,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(code);
      toast.success('代码已复制到剪贴板，可以手动分享');
    }
  };

  const handleResetCode = () => {
    if (window.confirm('确定要重置代码吗？这将清除当前内容。')) {
      const template = templatesData?.data?.templates?.[language]?.hello_world;
      setCode(template?.code || '');
      setOutput(null);
      toast.success('代码已重置');
    }
  };

  const handleTemplateSelect = (templateCode) => {
    setCode(templateCode);
    setShowTemplates(false);
    toast.success('模板已加载');
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };
    return extensions[lang] || 'txt';
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'c', label: 'C', icon: '🔧' },
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Terminal className="h-6 w-6 mr-2 text-primary-400" />
              代码编辑器
            </h1>
            
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? '运行中...' : '运行'}</span>
            </button>

            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">模板</span>
            </button>

            <button
              onClick={handleSaveCode}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">保存</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoadFile}
              accept=".js,.py,.html,.css,.java,.cpp,.c,.txt"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">加载</span>
            </button>

            <div className="flex items-center space-x-1 border-l border-gray-600 pl-2 ml-2">
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="复制代码"
              >
                <Copy className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleShareCode}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="分享代码"
              >
                <Share className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleResetCode}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="重置代码"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="设置"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title={isFullscreen ? '退出全屏' : '全屏'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-3 flex items-center text-sm text-gray-400">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          <span>快捷键: Ctrl+Enter 运行代码, Ctrl+S 保存文件</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {language.toUpperCase()} 代码编辑器
              </span>
              <span className="text-xs text-gray-500">
                {code.split('\n').length} 行, {code.length} 字符
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              theme={editorSettings.theme}
              options={{
                fontSize: editorSettings.fontSize,
                minimap: { enabled: editorSettings.minimap },
                wordWrap: editorSettings.wordWrap,
                lineNumbers: editorSettings.lineNumbers,
                formatOnType: editorSettings.formatOnType,
                autoClosingBrackets: editorSettings.autoClosingBrackets,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                renderWhitespace: 'boundary',
                contextmenu: true,
                mouseWheelZoom: true,
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          <CodeOutput output={output} isRunning={isRunning} />
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <CodeTemplates
          templates={templatesData?.data?.templates}
          snippets={snippetsData?.data?.snippets}
          language={language}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <CodeSettings
          settings={editorSettings}
          onChange={setEditorSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default CodeEditorPage;