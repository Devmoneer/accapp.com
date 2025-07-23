import React, { useState } from 'react';
import '../style/login.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('!بەرێز هێڤیە ئیمێل و پەیڤا نهێنی بنفیسە');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // Store user email in localStorage
            localStorage.setItem('userEmail', email);
            setError('');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError('!ئیمێل یان پەیڤا نهێنی هەڵەیە');
        }
    };

    return (
        <div className='body-login'>
            <div className='login-container'>
                <div className='heading-login'>چوناژوور</div>
                <form onSubmit={handleSubmit}>
                    <label>ئیمێل</label>
                    <input 
                        placeholder='..ئیمێلی خۆ بنفیسە' 
                        type='email' 
                        className='email-input' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>پەیڤا نهێنی</label>
                    <input 
                        placeholder='..پەیڤا نهێنی بنفیسە' 
                        type='password' 
                        className='password-input' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className='error-message'>{error}</p>}
                    <button type='submit' className='login'>چوناژوور</button>
                </form>
                <p className='info-for-user'>
                    <img alt='info-icon' src='images/info-circle-svgrepo-com.svg' width={25}/> <br/>
                    بەرێز داکۆ بشێی ڤی سیستەمێ ژمێریاری بکار بینی بۆ کومپانیا خۆ یان جهێ کارێ خۆ پێدڤیە پەیوەندیێ بمە بکەی ل سەر ڤێ ژمارێ ( 5010 346 0750 ) ب ئێك ژڤان رێکا
                </p>
                <div className='social-icons'>
                    <a href='#'><img alt='icon' src='images/whatsapp-social-media-svgrepo-com.svg' width={20}/></a>
                    <a href='#'><img alt='icon' src='images/telegram-svgrepo-com (1).svg' width={20}/></a>
                    <a href='#'><img alt='icon' src='images/instagram-svgrepo-com.svg' width={20}/></a>
                </div>
                <p className='text-about-app'>
                    سلاڤ بەرێز ئەڤ وێب ئەپلیکەیشنە هاتیە دروستکرن ژبۆ کار ئاسانیا ژمێریار ئانکو محاسبێ کومپانیا تە بۆ نفێسین ۆ تومارکرنا هەمی مامەلێن بۆ کومپانیا تە دهێن یان جهێ کارێ تە 
                </p>
            </div>
        </div>
    );
}

export default Login;