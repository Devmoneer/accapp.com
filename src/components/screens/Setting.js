import React, { useState, useEffect } from 'react';
import '../../style/Setting.css';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiSave, FiLogOut, FiLock, FiCheck, FiDroplet, FiSliders } from 'react-icons/fi';

function Setting() {
  const themes = [
    { name: 'Deep Teal', colors: ['#2C3333', '#2E4F4F', '#0E8388', '#CBE4DE'] },
    { name: 'Ocean Blue', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560'] },
    { name: 'Earth Tone', colors: ['#3A3845', '#826F66', '#C69B7B', '#F7CCAC'] },
    { name: 'Dark Mode', colors: ['#121212', '#1E1E1E', '#2A2A2A', '#FFFFFF'] },
    { name: 'Violet', colors: ['#2D033B', '#810CA8', '#C147E9', '#E5B8F4'] },
    { name: 'Sunset', colors: ['#FF5F00', '#FF1E1E', '#E80F88', '#FF9B50'] }
  ];

  const [activeTheme, setActiveTheme] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Moneer Jameil Omar',
    email: 'admin@example.com',
    phone: '5010 346 0750 964+'
  });
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const themeIndex = themes.findIndex(t => t.name === savedTheme);
      if (themeIndex !== -1) {
        handleThemeChange(themeIndex);
      }
    }
  }, []);

  const handleThemeChange = (index) => {
    setActiveTheme(index);
    const theme = themes[index];
    document.documentElement.style.setProperty('--primary-color', theme.colors[0]);
    document.documentElement.style.setProperty('--secondary-color', theme.colors[1]);
    document.documentElement.style.setProperty('--accent-color', theme.colors[2]);
    document.documentElement.style.setProperty('--background-color', theme.colors[3]);
    localStorage.setItem('selectedTheme', theme.name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    alert('! دەستکاری ب سەرکەفتیانە هاتە خەزن کرن');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };

  return (
    <div className='setting-container'>
      <div className='settings-header'>
        <h2>رێکخستن</h2>
        <p> رێکخستنێن پرۆفایلێ تە</p>
      </div>

      <div className='settings-content'>
        <div className='user-information-section card'>
          <div className='section-header'>
            <h3><FiSliders className="icon" /> زانیاریێن پرۆفایلێ تە</h3>
            {editMode ? (
              <button className='save-btn' onClick={handleSave}>
                <FiSave className="icon" /> خەزنکرنا دەستکاریێ
              </button>
            ) : (
              <button className='edit-btn' onClick={() => setEditMode(true)}>
                <FiEdit className="icon" /> دەستکاریکرنا پرۆفایلی
              </button>
            )}
          </div>

          {editMode ? (
            <div className='edit-form'>
              <div className='form-group'>
                <label>ناڤێ تمام</label>
                <input 
                  type='text' 
                  name='name' 
                  value={userData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name"
                />
              </div>
              <div className='form-group'>
                <label>ئیمێل</label>
                <input 
                  type='email' 
                  name='email' 
                  value={userData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter your email"
                />
              </div>
              <div className='form-group'>
                <label>ژمارا موبایلێ</label>
                <input 
                  type='tel' 
                  name='phone' 
                  value={userData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          ) : (
            <div className='user-info-display'>
              <div className='info-item'>
                <span className='info-label'>ناڤێ بکارهینەری:</span>
                <span className='info-value'>{userData.name}</span>
              </div>
              <div className='info-item'>
                <span className='info-label'>ئیمێل:</span>
                <span className='info-value'>{userData.email}</span>
              </div>
              <div className='info-item'>
                <span className='info-label'>ژمارا موبایلێ:</span>
                <span className='info-value'>{userData.phone}</span>
              </div>
            </div>
          )}
        </div>

        <div className='theme-section card'>
          <div className='section-header'>
            <h3><FiDroplet className="icon" /> ثیمێن بەردەست</h3>
            <button 
              className={`theme-toggle-btn ${showThemeSelector ? 'active' : ''}`}
              onClick={toggleThemeSelector}
            >
              {showThemeSelector ? 'گرتن' : 'نیشاندانا ثیمان'}
            </button>
          </div>
          <p>بۆ گهورینا دیزانێ بەرنامەی ب تەتمامێ</p>
          
          {showThemeSelector && (
            <div className='theme-options'>
              {themes.map((theme, index) => (
                <div 
                  key={index}
                  className={`theme-option ${index === activeTheme ? 'active' : ''}`}
                  onClick={() => handleThemeChange(index)}
                >
                  <div className='theme-preview'>
                    {theme.colors.map((color, i) => (
                      <div 
                        key={i} 
                        className='theme-color' 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className='theme-info'>
                    <span>{theme.name}</span>
                    {index === activeTheme && <FiCheck className="check-icon" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='account-actions card'>
          <h3><FiLock className="icon" /> کردارێن هژمارێ</h3>
          <div className='action-buttons'>
            <button className='change-password-btn'>
              <FiLock className="icon" /> گهورینا پەیڤا نهێنی
            </button>
            <button className='logout-btn' onClick={handleLogout}>
              <FiLogOut className="icon" /> چوونادەرڤە
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;