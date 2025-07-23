import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../../style/Homescreen.css";

function Transactions() {
    const [expenses, setExpenses] = useState([]);
    const [revenues, setRevenues] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('revenues'); // Default to revenues

    const auth = getAuth();
    const user = auth.currentUser;

    // Fetch user-specific data
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        
        // Expenses listener
        const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));
        const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date || "",
                amount: doc.data().amount ? doc.data().amount.toLocaleString() : "0"
            }));
            setExpenses(expensesData);
        });

        // Revenues listener
        const revenuesQuery = query(collection(db, "revenues"), where("userId", "==", user.uid));
        const unsubscribeRevenues = onSnapshot(revenuesQuery, (snapshot) => {
            const revenuesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date || "",
                amount: doc.data().amount ? doc.data().amount.toLocaleString() : "0"
            }));
            setRevenues(revenuesData);
        });

        // Budgets listener
        const budgetsQuery = query(collection(db, "budgets"), where("userId", "==", user.uid));
        const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
            const budgetsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date || "",
                amount: doc.data().amount ? doc.data().amount.toLocaleString() : "0",
                remaining: doc.data().remaining ? doc.data().remaining.toLocaleString() : "0"
            }));
            setBudgets(budgetsData);
        });

        setLoading(false);

        return () => {
            unsubscribeExpenses();
            unsubscribeRevenues();
            unsubscribeBudgets();
        };
    }, [user]);

    if (loading) {
        return (
            <div className="Homescreen-screen">
                <div className="homescreen-container">
                    <div className="loading-container" style={{ background: 'white', borderRadius: '16px', padding: '40px' }}>
                        <div className="loading-spinner"></div>
                        <p style={{ color: '#0E8388', marginTop: '16px' }}>بارکردن...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="Homescreen-screen">
            <div className="homescreen-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <h2 className="dashboard-header-text-h2">مامەلێن تە هەمی</h2>
                    <div className="currency-toggle">
                        <button 
                            className={activeSection === 'revenues' ? 'active' : ''}
                            onClick={() => setActiveSection('revenues')}
                        >
                            داهات
                        </button>
                        <button 
                            className={activeSection === 'expenses' ? 'active' : ''}
                            onClick={() => setActiveSection('expenses')}
                        >
                            خەرجی
                        </button>
                        <button 
                            className={activeSection === 'budgets' ? 'active' : ''}
                            onClick={() => setActiveSection('budgets')}
                        >
                            بودجە
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>بەریز هەر مامەلەکا تۆ</h3>
                        <p>داخل بکەی چ داهات بیتن یان خەرجی یان زیدەکرنا کەسەکی ل ڤێری دهێنە خەزن کرن</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="chart-container">
                    {/* Revenues Section */}
                    {activeSection === 'revenues' && (
                        <>
                            <div className="chart-header">
                                <h3>لیستا داهاتی</h3>
                                <p>هەمی داهاتێن تۆ ل ڤێر دیت</p>
                            </div>
                            <div className="table-header" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                padding: '12px 20px',
                                background: '#f1f3f5',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <span className="header-item">جۆر</span>
                                <span className="header-item">بڕ</span>
                                <span className="header-item">بەروار</span>
                                <span className="header-item">زێدەتر</span>
                            </div>
                            <div className="table-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {revenues.length > 0 ? (
                                    revenues.map((revenue) => (
                                        <div key={revenue.id} className="table-row" style={{ 
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            padding: '12px 20px',
                                            borderBottom: '1px solid #eee',
                                            alignItems: 'center',
                                            transition: 'background-color 0.2s'
                                        }}>
                                            <span className="row-item">{revenue.category}</span>
                                            <span className="row-item amount" style={{ fontWeight: 'bold', color: '#2c3e50' }}>{revenue.amount} IQD</span>
                                            <span className="row-item">{revenue.date}</span>
                                            <span className="row-item description" style={{ color: '#6c757d', fontSize: '0.9rem' }}>{revenue.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-message" style={{ 
                                        textAlign: 'center', 
                                        padding: '20px', 
                                        color: '#7f8c8d', 
                                        fontStyle: 'italic' 
                                    }}>هیچ داهاتێک تۆمار نەکراوە</div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Expenses Section */}
                    {activeSection === 'expenses' && (
                        <>
                            <div className="chart-header">
                                <h3>لیستا خەرجیان</h3>
                                <p>هەمی خەرجیێن تۆ ل ڤێر دیت</p>
                            </div>
                            <div className="table-header" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                padding: '12px 20px',
                                background: '#f1f3f5',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <span className="header-item">جۆر</span>
                                <span className="header-item">بڕ</span>
                                <span className="header-item">بەروار</span>
                                <span className="header-item">شێوازی پارەدان</span>
                                <span className="header-item">زێدەتر</span>
                            </div>
                            <div className="table-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <div key={expense.id} className="table-row" style={{ 
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            padding: '12px 20px',
                                            borderBottom: '1px solid #eee',
                                            alignItems: 'center',
                                            transition: 'background-color 0.2s'
                                        }}>
                                            <span className="row-item">{expense.category}</span>
                                            <span className="row-item amount" style={{ fontWeight: 'bold', color: '#2c3e50' }}>{expense.amount} IQD</span>
                                            <span className="row-item">{expense.date}</span>
                                            <span className="row-item">{expense.payMethod}</span>
                                            <span className="row-item description" style={{ color: '#6c757d', fontSize: '0.9rem' }}>{expense.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-message" style={{ 
                                        textAlign: 'center', 
                                        padding: '20px', 
                                        color: '#7f8c8d', 
                                        fontStyle: 'italic' 
                                    }}>هیچ خەرجییەک تۆمار نەکراوە</div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Budgets Section */}
                    {activeSection === 'budgets' && (
                        <>
                            <div className="chart-header">
                                <h3>لیستا بودجە</h3>
                                <p>هەمی بودجێن تۆ ل ڤێر دیت</p>
                            </div>
                            <div className="table-header" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                padding: '12px 20px',
                                background: '#f1f3f5',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <span className="header-item">جۆر</span>
                                <span className="header-item">بڕ</span>
                                <span className="header-item">بەروار</span>
                                <span className="header-item">ماوە</span>
                                <span className="header-item">زێدەتر</span>
                            </div>
                            <div className="table-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {budgets.length > 0 ? (
                                    budgets.map((budget) => (
                                        <div key={budget.id} className="table-row" style={{ 
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            padding: '12px 20px',
                                            borderBottom: '1px solid #eee',
                                            alignItems: 'center',
                                            transition: 'background-color 0.2s'
                                        }}>
                                            <span className="row-item">{budget.category}</span>
                                            <span className="row-item amount" style={{ fontWeight: 'bold', color: '#2c3e50' }}>{budget.amount} IQD</span>
                                            <span className="row-item">{budget.date}</span>
                                            <span className="row-item remaining" style={{ color: '#e74c3c', fontWeight: 'bold' }}>{budget.remaining} IQD</span>
                                            <span className="row-item description" style={{ color: '#6c757d', fontSize: '0.9rem' }}>{budget.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-message" style={{ 
                                        textAlign: 'center', 
                                        padding: '20px', 
                                        color: '#7f8c8d', 
                                        fontStyle: 'italic' 
                                    }}>هیچ بودجەیەک تۆمار نەکراوە</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Transactions;