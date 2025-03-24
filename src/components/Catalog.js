// src/components/Catalog.js
import React, { useState } from 'react';
import PersonalCatalog from './PersonalCatalog';
import BlogCatalog from './BlogCatalog';
import './Catalog.css';
import DevelopmentHistroy from './DevelopmentHistroy';

function Catalog() {
    const [activeComponent, setActiveComponent] = useState('personal');

    return (
        <div >
            <div className="catalog-base">
                <nav className="catalog-nav">
                    <button onClick={() => setActiveComponent('personal')}>Home</button>
                    <button onClick={() => setActiveComponent('blog')}>Blog</button>
                    <button onClick={() => setActiveComponent('development')}>Development</button>
                </nav>
            </div>
            <div className="catalog-content">
                {activeComponent === 'personal' && <PersonalCatalog />}
                {activeComponent === 'blog' && <BlogCatalog />}
                {activeComponent === 'development' && <DevelopmentHistroy />}
            </div>
        </div>
    );
}

export default Catalog;