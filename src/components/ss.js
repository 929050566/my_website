import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';             // markdown 对表格/删除线/脚注等的支持
import rehypeSlug from 'rehype-slug'; // 插件用于为标题生成 id
import MarkNav from 'markdown-navbar';          // markdown 目录

import 'markdown-navbar/dist/navbar.css';
import './BlogCatalog.css';
import '../styles/MarkdownStyles.css';
import translations from '../i18n/translations';

function BlogCatalog({ language, _selectedBlog, setSelectedBlog }) {
  const [content, setContent] = useState('');
  const [selectedBlog, _setSelectedBlog] = useState(null); // Local state
  const t = translations[language];
  console.log('selectedBlog', selectedBlog);

  const blogs = [
    // { title: t.blog1, file: require('../blogs/myblog.md') },
    // { title: t.blog2, file: require('../blogs/myblog.md') },
    { title: t.blog3, file: require('../blogs/eth/eth.md') },
    { title: t.blog4, file: require('../blogs/bitcoin/bitcoin_offline.md') },
    { title: t.blog5, file: require('../blogs/go/go_gc.md') },
    { title: t.blog6, file: require('../blogs/sui/sui.md') },
    { title: t.blog7, file: require('../blogs/xrp/xrp.md') },
    { title: t.blog8, file: require('../blogs/ton/ton.md') },
    { title: t.blog9, file: require('../blogs/nft/nft.md') },
    { title: t.blog10, file: require('../blogs/solidity/solidity.md') },

  ];

  useEffect(() => {
    _setSelectedBlog(_selectedBlog);
  }, [_selectedBlog]);

  useEffect(() => {
    
    if (selectedBlog) {
      fetch(selectedBlog.file)
        .then((response) => response.text())
        .then((text) => setContent(text));
    }
  }, [selectedBlog]);

  const handleBlogSelection = (blog) => {
    _setSelectedBlog(blog); // Update local state
    setSelectedBlog(blog); // Notify parent
  };

  return (
    <div className="blog-all">
      <div className="history-title">
        <h1>{selectedBlog ? selectedBlog.title : t.blogCatalog}</h1>
      </div>
      {!selectedBlog && (
        <div className="blog-list">
          {blogs.map((blog, index) => (
            <div key={index} className="blog-title" onClick={() => handleBlogSelection(blog)}>
              {blog.title}
            </div>
          ))}
        </div>
      )}
      {selectedBlog && (
        <div className="markdown-container">
          <button className="back-button" onClick={() => setSelectedBlog(null)}>
            {t.backToList}
          </button>
          <div className="leftSide">
            <MarkNav
              className="toc"
              source={content}
              ordered={false}
              onNavItemClick={(e, id) => {
                e.preventDefault(); // Prevent default behavior
                // Get the hash from the URL
                const hash = window.location.hash; // e.g., "#heading-20"
                // Remove the "#" to get the actual value
                const headingId = hash.startsWith('#') ? hash.substring(1) : hash;
                const target = document.querySelector(`[data-id="${headingId}"]`); // Use data-id attribute to find the element
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the target
                }
              }}
            />
          </div>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]} // 添加 rehype-slug 插件
              children={content}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    src={props.src.startsWith('http') ? props.src : require(`../blogs/${props.src}`).default}
                    alt={props.alt}
                    style={{ maxWidth: '100%' }}
                  />
                ),
            }}
            >
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogCatalog;