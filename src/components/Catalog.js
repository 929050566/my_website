// src/components/Catalog.js
import React, { useState } from 'react';
import PersonalCatalog from './PersonalCatalog';
import BlogCatalog from './BlogCatalog';
import './Catalog.css';
import DevelopmentHistroy from './DevelopmentHistroy';

function Catalog() {
    const [activeComponent, setActiveComponent] = useState('personal');
    const [language, setLanguage] = useState('zh'); // Default language set to Chinese
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer
    const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'zh' ? 'en' : 'zh'));
    };

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    return (
        <div>
            <div className="catalog-base">
                <nav className="catalog-nav">
                    <button className="catalog-button" onClick={() => setActiveComponent('personal')}>
                        {language === 'en' ? 'Home' : '首页'}
                    </button>
                    <button
                        className="catalog-button"
                        onClick={() => {
                            setActiveComponent('blog');
                            setSelectedBlog(null); // Reset selected blog to trigger re-render
                        }}
                    >
                        {language === 'en' ? 'Blog' : '博客'}
                    </button>
                    <button className="catalog-button" onClick={() => setActiveComponent('development')}>
                        {language === 'en' ? 'Development' : '开发'}
                    </button>
                    <button className="catalog-button" onClick={toggleLanguage}>
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                </nav>
            </div>
            <div className="catalog-content">
                {activeComponent === 'personal' && (
                    <PersonalCatalog language={language} toggleLanguage={toggleLanguage} />
                )}
                {activeComponent === 'blog' && (
                    <BlogCatalog
                        language={language}
                        _selectedBlog={selectedBlog}
                        setSelectedBlog={setSelectedBlog} // Pass the callback
                    />
                )}
                {activeComponent === 'development' && <DevelopmentHistroy language={language} />}
            </div>
            {/* Sliding Drawer */}
            <div className={`language-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <button onClick={toggleDrawer} className="drawer-toggle">
                    {isDrawerOpen ? '>' : '<'}
                </button>
                {isDrawerOpen && (
                    <button onClick={toggleLanguage} className="language-toggle">
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Catalog;