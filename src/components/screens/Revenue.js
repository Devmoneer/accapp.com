import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../../style/Expenses.css";

function Revenue() {
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        currency: "IQD", // Added currency field
        date: new Date().toISOString().split('T')[0],
        description: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    const auth = getAuth();
    const user = auth.currentUser;

    const categories = [
        "کار",
        "فرۆشتن",
        "هەلیاری",
        "پشو",
        "داهاتی تر"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        
        try {
            await addDoc(collection(db, "revenues"), {
                userId: user.uid,
                category: formData.category,
                amount: parseFloat(formData.amount),
                currency: formData.currency, // Added currency to the document
                date: formData.date,
                description: formData.description,
                createdAt: new Date()
            });
            
            setSuccessMessage("داهات ب سەرکەفتی تۆمارکرا!");
            setFormData({
                category: "",
                amount: "",
                currency: "IQD", // Reset to IQD
                date: new Date().toISOString().split('T')[0],
                description: ""
            });
            
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error adding revenue: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="Expenses-screen">
            <div className="Expenses-container-wrapper">
                <div className="Expenses-container">
                    <div className="Heading">
                        <h2 className="Text-heading">
                           زێدەکرنا داهاتی
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="Expenses-information">
                            {successMessage && (
                                <div style={{
                                    background: "#d4edda",
                                    color: "#155724",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    textAlign: "center"
                                }}>
                                    {successMessage}
                                </div>
                            )}

                            <div className="input-row">
                                <div className="input-container">
                                    <label>جۆرێ داهاتی<img alt='icon' src='images/1doc.svg' width={20} className="notesicon"/></label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">جۆری هەلبژێرە</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-container">
                                    <label>بڕ<img alt='icon' src='images/dollaricon.svg' width={20} className="notesicon"/></label>
                                    <input 
                                        type="number" 
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder={formData.currency === 'IQD' ? '50000' : '50'} 
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-container">
                                    <label>جورێ دراڤی<img alt='icon' src='images/currency1.svg' width={20} className="notesicon"/></label>
                                    <select 
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                    >
                                        <option value={'IQD'}>دینارێ عێراقی</option>
                                        <option value={'USD'}>دولارێ ئەمریکی</option>
                                    </select>
                                </div>
                                <div className="input-container">
                                    <label>بەروار<img alt='icon' src='images/calendaricon.svg' width={20} className="notesicon"/></label>
                                    <input 
                                        type="date" 
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-container full-width">
                                <label>تێبینی<img alt='icon' src='images/notesicon.svg' width={20} className="notesicon"/></label>
                                <textarea 
                                    rows="4" 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="زێدەکرنێ دەربارەی ئەم داهاتە..."
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'دهێتە تۆمارکرن...' : 'تۆمارکرنا داهاتی'}
                                </button>
                                <button 
                                    type="reset" 
                                    className="cancel-btn"
                                    onClick={() => setFormData({
                                        category: "",
                                        amount: "",
                                        currency: "IQD",
                                        date: new Date().toISOString().split('T')[0],
                                        description: ""
                                    })}
                                >
                                    ژێبرن
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Revenue;