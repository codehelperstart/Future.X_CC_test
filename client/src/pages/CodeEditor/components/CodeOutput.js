import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const CodeOutput = ({ output, isRunning }) => {
  const outputRef = useRef(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCopyOutput = () => {
    if (output?.output) {
      navigator.clipboard.writeText(output.output);
      toast.success('输出已复制到剪贴板');
    }
  };

  const handleDownloadOutput = () => {
    if (output?.output) {
      const blob = new Blob([output.output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `output_${new Date().getTime()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('输出已下载');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">运行结果</span>
          </div>
          
          {output && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyOutput}
                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
                title="复制输出"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownloadOutput}
                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
                title="下载输出"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-hidden">
        {isRunning ? (
          <div className="h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-primary-400"
            >
              <RefreshCw className="h-8 w-8" />
            </motion.div>
            <span className="ml-3 text-gray-300">代码执行中...</span>
          </div>
        ) : output ? (
          <div className="h-full flex flex-col">
            {/* Status Bar */}
            <div className={`px-4 py-2 border-b border-gray-600 ${
              output.success 
                ? 'bg-green-900/30 border-green-700' 
                : 'bg-red-900/30 border-red-700'
            }`}>
              <div className="flex items-center space-x-2">
                {output.success ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  output.success ? 'text-green-300' : 'text-red-300'
                }`}>
                  {output.success ? '执行成功' : '执行失败'}
                </span>
                {output.executionTime && (
                  <div className="flex items-center space-x-1 text-gray-400 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{output.executionTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Output Text */}
            <div 
              ref={outputRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm"
            >
              {output.success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Standard Output */}
                  {output.output && (
                    <div className="mb-4">
                      <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
                        输出:
                      </div>
                      <pre className="text-green-300 whitespace-pre-wrap break-words bg-gray-900/50 p-3 rounded">
                        {output.output}
                      </pre>
                    </div>
                  )}

                  {/* HTML Preview (for HTML output) */}
                  {output.language === 'html' && output.output && (
                    <div className="mb-4">
                      <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
                        预览:
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-600">
                        <iframe
                          srcDoc={output.output}
                          className="w-full h-64 border-0"
                          title="HTML Preview"
                          sandbox="allow-scripts"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Error Output */}
                  <div className="mb-4">
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
                      错误信息:
                    </div>
                    <pre className="text-red-300 whitespace-pre-wrap break-words bg-red-900/20 p-3 rounded border border-red-700">
                      {output.error}
                    </pre>
                  </div>

                  {/* Partial Output */}
                  {output.output && (
                    <div className="mb-4">
                      <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
                        部分输出:
                      </div>
                      <pre className="text-gray-300 whitespace-pre-wrap break-words bg-gray-900/50 p-3 rounded">
                        {output.output}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Debug Info */}
              {output.language && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-gray-500 text-xs space-y-1">
                    <div>语言: {output.language.toUpperCase()}</div>
                    {output.executionTime && (
                      <div>执行时间: {output.executionTime}</div>
                    )}
                    <div>执行时间: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
            <Terminal className="h-16 w-16 mb-4 text-gray-600" />
            <p className="text-center mb-2">
              点击"运行"按钮执行代码
            </p>
            <p className="text-sm text-center text-gray-600">
              执行结果将在这里显示
            </p>

            {/* Quick Tips */}
            <div className="mt-6 space-y-2 text-xs text-gray-600">
              <p className="text-center font-medium mb-2">💡 使用提示:</p>
              <div className="space-y-1">
                <p>• 支持多种编程语言</p>
                <p>• 使用 console.log() 输出调试信息</p>
                <p>• 代码执行有时间限制</p>
                <p>• 支持基本的输入输出操作</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-700 px-4 py-2 border-t border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {output ? (
              `最后执行: ${new Date().toLocaleTimeString()}`
            ) : (
              '准备执行代码'
            )}
          </span>
          {output?.executionTime && (
            <span>耗时: {output.executionTime}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;