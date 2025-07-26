import React, { useState } from 'react';
import '../style/register.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('male');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getFirebaseErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return '!ئیمێل بەری نۆکە هاتیە تۆمارکرن';
            case 'auth/invalid-email':
                return '!ئیمێل نەدروستە';
            case 'auth/weak-password':
                return '!پەیڤا نهێنیێ زەحمەتتر هەڵبژێرە';
            default:
                return '!خەلەتیەک ڕوویدا، هیڤیە دووبارە هەوڵبدە';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('!بەرێز هێڤیە هەمی خاڵان پر بکە');
            return;
        }
        if (password !== confirmPassword) {
            setError('!پەیڤا نهێنی جودایە');
            return;
        }
        if (password.length < 6) {
            setError('!پێدڤیە ژ 6 پیتان کێمتر نەبیتن بەرێز');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                gender,
                emailVerified: false,
                createdAt: new Date()
            });

            alert('!کۆدی پشتڕاستکرن ب ئیمێلەکەت نێردرا. تکایە پشتڕاستی بکە');
            navigate('/verify-email');
        } catch (error) {
            setError(getFirebaseErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-card register-card'>
                <div className='auth-header'>
                    <div className='logo-wrapper'>
                        <img src='images/analysis-svgrepo-com.svg' alt='logo' className='auth-logo' />
                        <h1>سیستەمێ ژمێریاری</h1>
                    </div>
                    <h2>تۆمارکرن</h2>
                </div>
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className='input-group'>
                        <label>ناڤ</label>
                        <input 
                            placeholder='..ناڤێ خۆ بنفیسە' 
                            type='text' 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label>ئیمێل</label>
                        <input 
                            placeholder='..ئیمێلی خۆ بنفیسە' 
                            type='email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label>پەیڤا نهێنی (ژ 6 پیت کێمتر نەبیت)</label>
                        <input 
                            placeholder='..پەیڤا نهێنی بنفیسە' 
                            type='password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label>دووبارە پەیڤا نهێنی</label>
                        <input 
                            placeholder='..دووبارە پەیڤا نهێنی بنفیسە' 
                            type='password' 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className='input-group radio-group'>
                        <label>جێندەر</label>
                        <div className='radio-options'>
                            <label className='radio-label'>
                                <input 
                                    type='radio' 
                                    name='gender' 
                                    value='male' 
                                    checked={gender === 'male'} 
                                    onChange={() => setGender('male')}
                                />
                                <span className='radio-custom'></span>
                                نێر
                            </label>
                            <label className='radio-label'>
                                <input 
                                    type='radio' 
                                    name='gender' 
                                    value='female' 
                                    checked={gender === 'female'} 
                                    onChange={() => setGender('female')}
                                />
                                <span className='radio-custom'></span>
                                مێ
                            </label>
                        </div>
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    <button type='submit' className='auth-button' disabled={isLoading}>
                        {isLoading ? <span className='button-loader'></span> : 'تۆمارکرن'}
                    </button>
                    <div className='auth-footer'>
                        <p>هژمار تە هەیە؟ <button type='button' onClick={() => navigate('/login')}>چوناژوور</button></p>
                    </div>
                </form>
                <div className='auth-divider'>
                    <span>یان</span>
                </div>
                <div className='social-auth'>
                    <button type='button' className='social-button'>
                        <img src='images/google-svgrepo-com.svg' alt='google' />
                        تۆمارکرن ب گووگڵی
                    </button>
                    <button type='button' className='social-button'>
                        <img src='images/facebook-svgrepo-com.svg' alt='facebook' />
                        تۆمارکرن ب فەیسبووکی
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;