import React, { useState, useEffect } from 'react';
import './DevelopmentHistory.css';
import translations from '../i18n/translations';

function DevelopmentHistroy({ language }) {
  const [historyData, setHistoryData] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const t = translations[language];

  useEffect(() => {
    const data = new Map([
      ['2024-01-12', t.history7],
      ['2024-01-10', t.history6],
      ['2024-01-06', t.history1],
      ['2024-01-04', t.history2],
      ['2024-01-03', t.history3],
      ['2024-01-01', t.history4],
      ['2023-12-31', t.history5],
    ]);
    setHistoryData(data);
    setCurrentPage(1); // Reset to the first page when language changes
  }, [language, t]);

  const totalPages = Math.ceil(historyData.size / itemsPerPage);
  const paginatedData = Array.from(historyData.entries()).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="history-all">
        <div className="history-title">
          <h1>{t.developmentHistory}</h1>
        </div>
        <div className="history-timeline">
          <div className="history-items">
            {paginatedData.map(([date, content]) => (
              <div key={date} className="history-item">
                <h3>{date}</h3>
                <p>{content}</p>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {t.previous}
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevelopmentHistroy;

