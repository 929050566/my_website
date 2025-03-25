// src/components/Catalog.js
import React, { useState } from 'react';
import PersonalCatalog from './PersonalCatalog';
import BlogCatalog from './BlogCatalog';
import './Catalog.css';
import DevelopmentHistroy from './DevelopmentHistroy';

function Catalog() {
    const [activeComponent, setActiveComponent] = useState('personal');
    const [language, setLanguage] = useState('en'); // New state for language
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'zh' : 'en'));
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
                    <button className="catalog-button" onClick={() => setActiveComponent('blog')}>
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
                {activeComponent === 'blog' && <BlogCatalog language={language} />}
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