import React, { useState, useEffect } from 'react';
import './DevelopmentHistory.css';
import translations from '../i18n/translations';

function DevelopmentHistroy({ language }) {
  const [historyData, setHistoryData] = useState(new Map());
  const t = translations[language];

  useEffect(() => {
    const data = new Map([
      ['2022-01-06', t.history1],
      ['2022-01-04', t.history2],
      ['2022-01-03', t.history3],
      ['2022-01-01', t.history4],
      ['2022-12-31', t.history5],
      ['2023-01-03', t.history6],
    ]);
    setHistoryData(data);
  }, [language, t]);

  return (
    <div>
      <div className="history-all">
        <div className="history-title">
          <h1>{t.developmentHistory}</h1>
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
    </div>
  );
}

export default DevelopmentHistroy;

