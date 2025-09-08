import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Heart, Github, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: '功能特色', href: '#features' },
      { name: '课程目录', href: '/courses' },
      { name: '社区交流', href: '/community' },
      { name: '代码编辑器', href: '/editor' },
    ],
    company: [
      { name: '关于我们', href: '#about' },
      { name: '团队介绍', href: '#team' },
      { name: '联系我们', href: '#contact' },
      { name: '加入我们', href: '#careers' },
    ],
    resources: [
      { name: '学习指南', href: '#guide' },
      { name: 'API文档', href: '#api' },
      { name: '开发者社区', href: '/community' },
      { name: '常见问题', href: '#faq' },
    ],
    legal: [
      { name: '使用条款', href: '#terms' },
      { name: '隐私政策', href: '#privacy' },
      { name: 'Cookie政策', href: '#cookies' },
      { name: '版权声明', href: '#copyright' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AI编程学习平台</span>
            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-md">
              专为新手设计的AI编程学习平台，提供互动式学习体验、社区交流和实践编程环境。
              让每个人都能轻松掌握AI编程技能。
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@ai-learning.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              产品
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              公司
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              资源
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </a>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-gray-300">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© {currentYear} AI编程学习平台</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center">
                用 <Heart className="h-4 w-4 text-red-500 mx-1" /> 制作
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>本平台致力于推广AI编程教育，帮助更多人掌握人工智能技术</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;