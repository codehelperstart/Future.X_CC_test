import React from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Palette, Type, Eye } from 'lucide-react';

const CodeSettings = ({ settings, onChange, onClose }) => {
  const handleSettingChange = (key, value) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const themes = [
    { value: 'vs', label: '浅色主题', preview: 'bg-white text-black' },
    { value: 'vs-dark', label: '深色主题', preview: 'bg-gray-900 text-white' },
    { value: 'hc-black', label: '高对比度', preview: 'bg-black text-yellow-400' },
  ];

  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24];

  const wordWrapOptions = [
    { value: 'off', label: '关闭' },
    { value: 'on', label: '开启' },
    { value: 'wordWrapColumn', label: '按列换行' },
    { value: 'bounded', label: '有界' },
  ];

  const lineNumberOptions = [
    { value: 'on', label: '显示' },
    { value: 'off', label: '隐藏' },
    { value: 'relative', label: '相对行号' },
    { value: 'interval', label: '间隔显示' },
  ];

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
        className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-700 p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">编辑器设置</h2>
                <p className="text-gray-300 text-sm">自定义您的代码编辑体验</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6 max-h-[calc(90vh-150px)] overflow-y-auto space-y-6">
          {/* Theme Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">外观主题</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((theme) => (
                <label
                  key={theme.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    settings.theme === theme.value
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={settings.theme === theme.value}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-8 rounded mr-4 ${theme.preview} border border-gray-400`}>
                  </div>
                  <span className="text-white font-medium">{theme.label}</span>
                  {settings.theme === theme.value && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Font Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Type className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">字体设置</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  字体大小: {settings.fontSize}px
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="10"
                    max="24"
                    step="2"
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="grid grid-cols-4 gap-1 ml-4">
                    {fontSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSettingChange('fontSize', size)}
                        className={`px-2 py-1 text-xs rounded ${
                          settings.fontSize === size
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">显示设置</h3>
            </div>
            <div className="space-y-4">
              {/* Word Wrap */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  自动换行
                </label>
                <select
                  value={settings.wordWrap}
                  onChange={(e) => handleSettingChange('wordWrap', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {wordWrapOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Numbers */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  行号显示
                </label>
                <select
                  value={settings.lineNumbers}
                  onChange={(e) => handleSettingChange('lineNumbers', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {lineNumberOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  显示缩略图
                </label>
                <button
                  onClick={() => handleSettingChange('minimap', !settings.minimap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.minimap ? 'bg-primary-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.minimap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Format on Type */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  自动格式化
                </label>
                <button
                  onClick={() => handleSettingChange('formatOnType', !settings.formatOnType)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.formatOnType ? 'bg-primary-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.formatOnType ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Closing Brackets */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  自动闭合括号
                </label>
                <select
                  value={settings.autoClosingBrackets}
                  onChange={(e) => handleSettingChange('autoClosingBrackets', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="always">始终</option>
                  <option value="languageDefined">语言定义</option>
                  <option value="beforeWhitespace">空白前</option>
                  <option value="never">从不</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">预览效果</h3>
            <div 
              className={`p-4 rounded-lg border-2 ${
                settings.theme === 'vs' 
                  ? 'bg-white border-gray-300' 
                  : 'bg-gray-900 border-gray-600'
              }`}
            >
              <div 
                className={`font-mono ${
                  settings.theme === 'vs' ? 'text-gray-900' : 'text-gray-100'
                }`}
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <div className="flex">
                  {settings.lineNumbers !== 'off' && (
                    <div className={`mr-4 select-none ${
                      settings.theme === 'vs' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      1<br/>2<br/>3
                    </div>
                  )}
                  <div>
                    <div className="text-blue-600">function</div>
                    <div className="text-purple-600">  console.log("Hello World!");</div>
                    <div className="text-gray-600">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              设置会自动保存并立即生效
            </div>
            <button
              onClick={onClose}
              className="btn btn-primary"
            >
              完成
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodeSettings;