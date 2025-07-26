// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import "../style/Dashboard.css";
import Setting from "./screens/Setting";
import Notification from "./screens/Notification";
import HomeScreen from "./screens/HomeScreen";
import Transiction from "./screens/Transiction";
import Expenses from "./screens/Expenses";
import Report from "./screens/Report";
import Revenue from "./screens/Revenue";

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState(() => {
    return localStorage.getItem("activeNav") || "دەستپێک";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false);

  useEffect(() => {
    // Check if user just logged in
    const userJustLoggedIn = localStorage.getItem('justLoggedIn');
    if (userJustLoggedIn) {
      setShowLoginNotification(true);
      localStorage.removeItem('justLoggedIn');
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowLoginNotification(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeNav", activeNav);
  }, [activeNav]);

  const navItems = [
    {
      icon: activeNav === "دەستپێک"
        ? <img alt="icon" src="images/Group 3.svg" style={{width: 20}} />
        : <img alt="icon" src="images/Group 2.svg" style={{width: 20}} />,
      label: "دەستپێک"
    },
    { 
      icon: activeNav === "مامەلە" 
        ? <img alt="icon" src="images/tran2.svg" style={{width: 20}} />
        : <img alt="icon" src="images/tran1.svg" style={{width: 20}} />,
      label: "مامەلە" 
    },
    {
      icon: activeNav === "راپورتێن دارای"
        ? <img alt="icon" src="images/list2.svg" style={{width: 16}} />
        : <img alt="icon" src="images/list1.svg" style={{width: 16}} />,
      label: "راپورتێن دارای"
    },
    { 
      icon: activeNav === "خەرجی"
        ? <img alt="icon" src="images/expen2.svg" style={{width: 20}} />
        : <img alt="icon" src="images/expen1.svg" style={{width: 20}} />,
      label: "خەرجی" 
    },
    { 
      icon: activeNav === "داهات"
        ? <img alt="icon" src="images/dol2.svg" style={{width: 20}} />
        : <img alt="icon" src="images/dol1.svg" style={{width: 20}} />,
      label: "داهات" 
    },
    { 
      icon: activeNav === "رێکخستن"
        ? <img alt="icon" src="images/sett2.svg" style={{width: 20}} />
        : <img alt="icon" src="images/sett1.svg" style={{width: 20}} />,
      label: "رێکخستن" 
    },
    {
      icon: activeNav === "ئاگەهداری"
        ? <img alt="icon" src="images/ntf2.svg" style={{width: 15}} />
        : <img alt="icon" src="images/ntf1.svg" style={{width: 20}} />,
      label: "ئاگەهداری"
    },
  ];

  return (
    <div className="body">
      {showLoginNotification && (
        <div className="login-notification-box">
          <svg className="dashed-border" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
          </svg>
          <h3>بەخێربێی بۆ سیستەمێ ژمێریاری</h3>
          <p>سلاڤ بەرێز، ئەڤ سیستەمە بۆ کار ئاسانیا ژمێریارێ تە هاتیە دروستکرن</p>
          <button onClick={() => setShowLoginNotification(false)}>باشە</button>
        </div>
      )}

      <header className={`header ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
        <div className="header-container">
          <div className="logo-acc">
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`menu-icon ${isMobileMenuOpen ? "open" : ""}`}></span>
            </button>
            <div className="logo-wrapper">
              <span className="logo-icon">
                <img alt="" src="images/analysis-svgrepo-com.svg" width={20}/>
              </span>
              <span className="logo-text">سیستەمێ ژمێریاری</span>
            </div>
          </div>

          <nav className={`nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li className="nav-item" key={item.label}>
                  <button
                    type="button"
                    className={`nav-link${activeNav === item.label ? " active" : ""}`}
                    onClick={() => {
                      setActiveNav(item.label);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-indicator"></span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="total">
        {activeNav === "رێکخستن" && <Setting />}
        {activeNav === "ئاگەهداری" && <Notification />}
        {activeNav === "دەستپێک" && <HomeScreen />}
        {activeNav === "مامەلە" && <Transiction />}
        {activeNav === "خەرجی" && <Expenses />}
        {activeNav === "راپورتێن دارای" && <Report />}
        {activeNav === "داهات" && <Revenue />}
      </div>
    </div>
  );
};

export default Dashboard;