import React, { useState } from 'react';
import '../style/login.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = '!ئیمێل پێدڤیە';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '!ئیمێل دروست نینە';
      valid = false;
    }

    if (!password) {
      newErrors.password = '!پەیڤا نهێنی پێدڤیە';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = '!پێدڤیە ژ 6 پیتان کێمتر نەبیتن بەرێز';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('justLoggedIn', 'true');
      setErrors({ ...errors, general: '' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ ...errors, general: '!ئیمێل یان پەیڤا نهێنی خەڵەتە' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <div className='logo-wrapper'>
            <img src='images/analysis-svgrepo-com.svg' alt='logo' className='auth-logo' />
            <h1>سیستەمێ ژمێریاری</h1>
          </div>
          <h2>چوناژوور</h2>
        </div>

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='input-group'>
            <label>ئیمێل</label>
            <input
              placeholder='..ئیمێلی خۆ بنفیسە'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' });
              }}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="input-error-message">{errors.email}</span>}
          </div>

          <div className='input-group'>
            <label>پەیڤا نهێنی</label>
            <input
              placeholder='..پەیڤا نهێنی بنفیسە'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' });
              }}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="input-error-message">{errors.password}</span>}
          </div>

          {errors.general && <p className='error-message'>{errors.general}</p>}

          <button type='submit' className='login' disabled={isLoading}>
            {isLoading ? (
              <div className="spinner">
                <div className="spinner-sector spinner-sector-red"></div>
                <div className="spinner-sector spinner-sector-blue"></div>
                <div className="spinner-sector spinner-sector-green"></div>
              </div>
            ) : 'چوناژوور'}
          </button>

          <div className='auth-footer'>
            <p>تەهێشتا ئەکاونت نینە؟ <span className="auth-link" onClick={() => navigate('/register')}>خۆ تۆمار بکە</span></p>
          </div>
        </form>

        <div className='auth-divider'>
          <span className='divider-text'>یان</span>
        </div>

        <div className='social-auth'>
          <button className='social-button google'>
            <img src='images/google-svgrepo-com.svg' alt='google' />
            چوناژوور ب گووگڵی
          </button>
          <button className='social-button facebook'>
            <img src='images/facebook-svgrepo-com.svg' alt='facebook' />
            چوناژوور ب فەیسبووکی
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
