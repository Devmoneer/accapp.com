// HomeScreen.js
import React, { useEffect, useState } from "react";
import "../../style/Homescreen.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EXCHANGE_RATE = 1411.50; 

function Homescreen() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profit: 0,
    expenses: 0,
    expensesIQD: 0,
    expensesUSD: 0,
    revenuesIQD: 0,
    revenuesUSD: 0
  });

  const [showCurrency, setShowCurrency] = useState('USD');
  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'داهات',
        data: [1200, 1900, 1500, 2000, 1800, 2200],
        borderColor: '#0E8388',
        backgroundColor: 'rgba(14, 131, 136, 0.15)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0E8388',
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone'
      },
      {
        label: 'خەرجی',
        data: [800, 1200, 1000, 1500, 1300, 1700],
        borderColor: '#E94560',
        backgroundColor: 'rgba(233, 69, 96, 0.10)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#E94560',
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone'
      }
    ]
  });

  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.displayName || 'User',
        email: user.email || '',
      }));

      // Fetch expenses
      const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
        let totalExpensesIQD = 0;
        let totalExpensesUSD = 0;
        
        snapshot.docs.forEach(doc => {
          const expense = doc.data();
          if (expense.currency === "IQD") {
            totalExpensesIQD += expense.amount;
          } else {
            totalExpensesUSD += expense.amount;
          }
        });
        
        const totalExpensesUSDEquivalent = totalExpensesUSD + (totalExpensesIQD / EXCHANGE_RATE);
        
        setUserData(prev => ({ 
          ...prev, 
          expenses: totalExpensesUSDEquivalent,
          expensesIQD: totalExpensesIQD,
          expensesUSD: totalExpensesUSD
        }));
      });

      // Fetch revenues
      const revenuesQuery = query(collection(db, "revenues"), where("userId", "==", user.uid));
      const unsubscribeRevenues = onSnapshot(revenuesQuery, (snapshot) => {
        let totalRevenuesIQD = 0;
        let totalRevenuesUSD = 0;
        
        snapshot.docs.forEach(doc => {
          const revenue = doc.data();
          if (revenue.currency === "IQD") {
            totalRevenuesIQD += revenue.amount;
          } else {
            totalRevenuesUSD += revenue.amount;
          }
        });
        
        const totalRevenuesUSDEquivalent = totalRevenuesUSD + (totalRevenuesIQD / EXCHANGE_RATE);
        
        setUserData(prev => ({ 
          ...prev, 
          profit: totalRevenuesUSDEquivalent,
          revenuesIQD: totalRevenuesIQD,
          revenuesUSD: totalRevenuesUSD
        }));
      });

      return () => {
        unsubscribeExpenses();
        unsubscribeRevenues();
      };
    }
  }, [auth]);

  const formatAmount = (amount) => {
    if (showCurrency === 'IQD') {
      return Math.round(amount * EXCHANGE_RATE).toLocaleString() + ' IQD';
    }
    return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        labels: {
          color: '#2C3333',
          font: { 
            size: 14, 
            weight: 'bold',
            family: "'Noto Kufi Arabic', sans-serif"
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#0E8388',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2E4F4F',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          family: "'Noto Kufi Arabic', sans-serif"
        },
        bodyFont: {
          family: "'Noto Kufi Arabic', sans-serif"
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(44,51,51,0.08)'
        },
        ticks: {
          color: '#2E4F4F',
          font: { 
            size: 12,
            family: "'Noto Kufi Arabic', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(44,51,51,0.08)'
        },
        ticks: {
          color: '#2E4F4F',
          font: { 
            size: 12,
            family: "'Noto Kufi Arabic', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="Homescreen-screen">
      <div className="homescreen-container">
        <div className="dashboard-header">
          <h2 className="dashboard-header-text-h2" style={{ color: '#2C3333', margin: 0 }}>داشبۆرد</h2>
          <div className="currency-toggle">
            <button 
              onClick={() => setShowCurrency('USD')}
              className={showCurrency === 'USD' ? 'active' : ''}
            >
              USD
            </button>
            <button 
              onClick={() => setShowCurrency('IQD')}
              className={showCurrency === 'IQD' ? 'active' : ''}
            >
              IQD
            </button>
          </div>
        </div>

        <div className="top-row">
          <div className="profile-card">
            <img 
              src={userData.avatar} 
              alt="User Avatar" 
              className="user-avatar" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'path/to/default/avatar.png';
              }}
            />
            <div className="user-details">
              <h3>{userData.name}</h3>
              <p>{userData.email}</p>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <h4>سەرجەمێ داهاتی</h4>
              <p>{formatAmount(userData.profit)}</p>
            </div>
            <div className="summary-card">
              <h4>سەرجەمێ خەرجیان</h4>
              <p>{formatAmount(userData.expenses)}</p>
            </div>
            <div className="summary-card">
              <h4>بالانس</h4>
              <p>{formatAmount(userData.profit - userData.expenses)}</p>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>چارتێ هەیڤانە یێ خەرجیان و داهاتی</h3>
            <p>بەرێز ژ بۆ دیتنا چارتێ داهاتی یان خەرجیان بتنێ کلیک ل سەر بکە!</p>
          </div>
          <div className="chart-wrapper">
            <Line data={monthlyData} options={chartOptions} />
          </div>
        </div>

        <div className="quick-actions">
          <div className="actions-header">
            <h3>دروستکرنا هژمارا</h3>
            <p>
              بەرێز ل ڤان بەشان تۆ دێ شێی ناڤێ کەسەکی دگەل برە پارەیەکی و رۆژا مامەلێ ئەگەر ب دەین بیتن یان تە ل دەف کەسەکی 
              ب دەین ئینایە تۆ دشێی لڤان بەشان تۆمار بکەی داکۆ هەردەم ل بیرا تەبیتن
            </p>
          </div>
          <div className="action-buttons">
            <button className="action-button">
              بەشێ پارێن تە ل خەلکی
            </button>
            <button className="action-button">
              بەشێ پارێن خەلکی ل دەڤ تە
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homescreen;