import React from 'react';
import ReactMarkdown from 'react-markdown';
import './BlogCatalog.css';

// List of blog titles and their corresponding Markdown files
const blogs = [
  { title: 'Go 语言基础数据类型与基础语法', file: require('../blogs/myblog.md') },
  { title: 'React Hooks 使用指南', file: require('../blogs/myblog.md') },
  // Add more blogs here
];

function BlogCatalog() {
  const [content, setContent] = React.useState('');
  const [selectedBlog, setSelectedBlog] = React.useState(null);

  React.useEffect(() => {
    if (selectedBlog) {
      fetch(selectedBlog.file)
        .then((response) => response.text())
        .then((text) => setContent(text));
    }
  }, [selectedBlog]);

  return (
    <div className="blog-all">
      <div className="history-title">
        <h1>{selectedBlog ? selectedBlog.title : 'Blog Catalog'}</h1>
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
          <button className='back-button' onClick={() => setSelectedBlog(null)}>Back to list</button>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default BlogCatalog;