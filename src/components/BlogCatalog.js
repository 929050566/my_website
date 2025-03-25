import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './BlogCatalog.css';
import '../styles/MarkdownStyles.css';
import translations from '../i18n/translations';

function BlogCatalog({ language }) {
  const [content, setContent] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const t = translations[language];

  const blogs = [
    { title: t.blog1, file: require('../blogs/myblog.md') },
    { title: t.blog2, file: require('../blogs/myblog.md') },
    { title: t.blog3, file: require('../blogs/eth/eth.md') },
  ];

  useEffect(() => {
    if (selectedBlog) {
      fetch(selectedBlog.file)
        .then((response) => response.text())
        .then((text) => setContent(text));
    }
  }, [selectedBlog]);

  return (
    <div className="blog-all">
      <div className="history-title">
        <h1>{selectedBlog ? selectedBlog.title : t.blogCatalog}</h1>
      </div>
      {!selectedBlog && (
        <div className="blog-list">
          {blogs.map((blog, index) => (
            <div key={index} className="blog-title" onClick={() => setSelectedBlog(blog)}>
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
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    src={require(`../blogs/${props.src}`)}
                    alt={props.alt}
                    style={{ maxWidth: '100%' }}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogCatalog;