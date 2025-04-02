import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import MarkNav from 'markdown-navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a theme
import 'markdown-navbar/dist/navbar.css';
import './BlogCatalog.css';
import '../styles/MarkdownStyles.css';
import translations from '../i18n/translations';

function BlogCatalog({ language, _selectedBlog, setSelectedBlog }) {
  const [content, setContent] = useState('');
  const [selectedBlog, _setSelectedBlog] = useState(null); // Local state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const blogsPerPage = 10; // Number of blogs per page
  const t = translations[language];
  console.log('selectedBlog', selectedBlog);

  const blogs = [
    // { title: t.blog1, file: require('../blogs/myblog.md') },
    // { title: t.blog2, file: require('../blogs/myblog.md') },
    { title: t.blog3, file: require('../blogs/eth/eth.md') },
    { title: t.blog20, file: require('../blogs/eth/eth_transcation_types.md') },
    { title: t.blog22, file: require('../blogs/wallet/decentralized_wallet.md') },
    { title: t.blog23, file: require('../blogs/wallet/dex.md') },
    { title: t.blog4, file: require('../blogs/bitcoin/bitcoin_offline.md') },
    { title: t.blog5, file: require('../blogs/go/go_gc.md') },
    { title: t.blog6, file: require('../blogs/sui/sui.md') },
    { title: t.blog7, file: require('../blogs/xrp/xrp.md') },
    { title: t.blog8, file: require('../blogs/ton/ton.md') },
    { title: t.blog9, file: require('../blogs/nft/nft.md') },
    { title: t.blog10, file: require('../blogs/solidity/solidity.md') },
    { title: t.blog11, file: require('../blogs/solidity_audit/solidity_audit.md') },
    { title: t.blog12, file: require('../blogs/cosmos/cosmos.md') },
    { title: t.blog13, file: require('../blogs/kda/kda.md') },
    { title: t.blog14, file: require('../blogs/golang_contract/golang_contract.md') },
    { title: t.blog15, file: require('../blogs/wallet/wallet.md') },
    { title: t.blog16, file: require('../blogs/near/near.md') },
    { title: t.blog17, file: require('../blogs/bitcoin/bitcoin_inscription.md') },
    { title: t.blog18, file: require('../blogs/wallet/AAwallet.md') },
    { title: t.blog19, file: require('../blogs/wallet/crypto.md') },
    { title: t.blog21, file: require('../blogs/solana/solana.md') },

  ];

  const totalPages = Math.ceil(blogs.length / blogsPerPage); // Calculate total pages
  const currentBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage); // Blogs for the current page

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="blog-all">
      <div className="history-title">
        <h1>{selectedBlog ? selectedBlog.title : t.blogCatalog}</h1>
      </div>
      {!selectedBlog && (
        <div className="blog-list">
          {currentBlogs.map((blog, index) => (
            <div key={index} className="blog-title" onClick={() => handleBlogSelection(blog)}>
              {blog.title}
            </div>
          ))}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedBlog && (
        <div className="markdown-container">
          {/* <button className="back-button" onClick={() => setSelectedBlog(null)}>
            {t.backToList}
          </button> */}
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
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    src={require(`../blogs/${props.src}`)}
                    alt={props.alt}
                    style={{ maxWidth: '100%' }}
                  />
                ),
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
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