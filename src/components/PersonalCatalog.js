import React from 'react';
import profileImage from '../images/me2.jpg';
import './PersonalCatalog.css';

function PersonalCatalog() {
  return (
    <div className="personal-page">
      <div className="header">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <div>
          <h1>Draven Zhang</h1>
          <p>fullstack software engineer</p>
          <p>I have worked in Tuya, Didi and Mango TV</p>
          <p>Nanchang Hangkong University</p>
        </div>
      </div>
      <div className="contact-info">
        <h2>联系方式</h2>
        <div className="contact-item">
          <span>电话:</span>
          <a href="tel:15879171525">+86 15879171525</a>
        </div>
        <div className="contact-item">
          <span>电子邮箱:</span>
          <a href="929050566@qq.com">929050566@qq.com</a>
        </div>
        <div className="contact-item">
          <span>GitHub:</span>
          <a href="https://github.com/929050566" target="_blank" rel="noopener noreferrer">https://github.com/929050566</a>
        </div>
      </div>
    </div>
  );
}

export default PersonalCatalog;