import React, { useState, useEffect } from 'react';

const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessGranted');
    if (storedAccess === 'true') {
      setAccessGranted(true);
    }
  }, []);

  const checkPassword = () => {
    if (password === 'fayna2025') {
      setAccessGranted(true);
      localStorage.setItem('accessGranted', 'true');
    } else {
      setError(true);
    }
  };

  const handlePassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkPassword();
    }
  };

  if (!accessGranted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Cuprum, sans-serif',
        background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
        color: '#111',
        textAlign: 'center',
        padding: '2rem',
        animation: 'fadeIn 1s ease-out'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .gate-input:focus {
            outline: none;
            border-color: #111;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
          }
          .gate-title {
            font-size: 2.2rem;
            margin-bottom: 0.75rem;
            font-weight: 700;
          }
          .gate-subtitle {
            font-size: 1rem;
            color: #666;
            margin-bottom: 0.25rem;
          }
          .gate-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            font-family: 'Cuprum', sans-serif;
            background: black;
            color: white;
            border: none;
            border-radius: 0;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.4), 0 0 24px rgba(0, 0, 0, 0.2);
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 1.5rem;
          }
          .gate-button::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: all 0.75s ease;
          }
          .gate-button:hover::after {
            left: 100%;
          }
          .gate-button:hover {
            background: white;
            color: black;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          }
        `}</style>

        <div style={{
          fontSize: '10vw',
          marginBottom: '1.5rem',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))'
        }}>🚧</div>

        <h1 className="gate-title">Цей сайт ще в розробці</h1>

        <h2 className="gate-subtitle">🔒 Введіть пароль для доступу</h2>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePassword}
          className="gate-input"
          style={{
            marginTop: '0.5rem',
            padding: '0.9rem 1.25rem',
            fontSize: '1rem',
            border: '2px solid #ccc',
            borderRadius: '0',
            fontFamily: 'Cuprum, sans-serif',
            transition: 'all 0.3s ease',
            width: '100%',
            maxWidth: '300px',
            background: '#fff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
          }}
        />
        <button
          onClick={checkPassword}
          className="gate-button"
        >
          Увійти
        </button>
        <div style={{ minHeight: '1.5rem', marginTop: '0.75rem' }}>
          {error && (
            <p style={{ color: 'red', margin: 0, fontSize: '0.95rem' }}>
              Невірний пароль. Спробуйте ще раз.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordGate;
