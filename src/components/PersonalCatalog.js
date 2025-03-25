import React from 'react';
import './PersonalCatalog.css';
import translations from '../i18n/translations';

function PersonalCatalog({ language }) {
  const t = translations[language];

  return (
    <div className="personal-page">
      <div className="header">
        <h1>👋 {t.greeting}</h1>
      </div>
      <div className="content">
      <h3>{t.title}</h3>
      <section>
          <h3>{t.introductionTitle}</h3>
          <p>{t.introduction1}</p>
          <p>{t.introduction2}</p>
        </section>
        <section>
          <h3>{t.skillsTitle}</h3>
          <ul>
            <li>{t.skill1}</li>
            <li>{t.skill2}</li>
            <li>{t.skill3}</li>
            <li>{t.skill4}</li>
            <li>{t.skill5}</li>
            <li>{t.skill6}</li>
            <li>{t.skill7}</li>
            <li>{t.skill8}</li>
          </ul>
        </section>
        <section className="contact">
          <h3>{t.contactTitle}</h3>
          <p>Email: <a href={`mailto:${t.email}`}>{t.email}</a></p>
        </section>
      </div>
    </div>
  );
}

export default PersonalCatalog;