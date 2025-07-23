import React, { useState } from "react";
import '../../style/Expenses.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

function Expenses() {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        currency: 'IQD',
        date: '',
        description: ''
    });
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        
        if (!user) return;

        try {
            await addDoc(collection(db, "expenses"), {
                userId: user.uid,
                category: formData.category,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                date: formData.date,
                description: formData.description,
                createdAt: new Date()
            });
            // Reset form
            setFormData({
                category: '',
                amount: '',
                currency: 'IQD',
                date: '',
                description: ''
            });
            alert("خەرجی ب سەرکەفتی تۆمارکر!");
        } catch (error) {
            console.error("Error adding expense: ", error);
            alert("خەلەتیەک یا هەی بەرێز!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="Expenses-screen">
            <div className="Expenses-container-wrapper">
                <div className="Expenses-container">
                    <div className="Heading">
                        <h2 className="Text-heading">
                            زێدەکرنا خەرجیان
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="Expenses-information">
                            <div className="input-row">
                                <div className="input-container">
                                    <label>جورێ خەرجیێ<img alt='icon' src='images/1doc.svg' width={20} className="notesicon"/></label>
                                    <input 
                                        type="text" 
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="نووسینێ جورێ خەرجیێ" 
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label>بڕێ پارەی<img alt='icon' src='images/dollaricon.svg' width={20} className="notesicon"/></label>
                                    <input 
                                        type="number" 
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="نووسینێ بڕێ پارەی" 
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
                                    <label>بەروار</label>
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
                                    placeholder="هەر تێبینیەک هەبیت بنفیسە..."
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn">تۆمارکرن</button>
                                <button type="reset" className="cancel-btn">ژێبرن</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Expenses;