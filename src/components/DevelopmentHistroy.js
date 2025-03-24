// src/components/BlogCatalog.js
import React from 'react';
import './DevelopmentHistory.css';
import { useState, useEffect } from 'react';


function DevelopmentHistroy() {
  const [historyData, setHistoryData] = useState(new Map());

  useEffect(() => {
    // 假设您有一个 Map 存储历史记录数据
    const data = new Map([
      ['2025-01-06', 'Added a blog listing page, todo: md documentation presentation is too ugly and in urgent need of optimization'],
      ['2025-01-04', 'Build the blog page although this css is not good'],
      ['2025-01-03', 'Build the home page'],
      ['2025-01-01', 'Build the development history page'],
      ['2024-12-31', 'The first day of building the website'],
    ]);
    setHistoryData(data);
  }, []);

  return (
    <div>
      <div className="history-all">
        <div className='history-title'>        
          <h1>Development Histroy</h1>
        </div>
        <div className="history-timeline">
          <div className="history-items">
            {Array.from(historyData.entries()).map(([date, content]) => (
              <div key={date} className="history-item">
                <h3>{date}</h3>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >

  )

}

export default DevelopmentHistroy;

