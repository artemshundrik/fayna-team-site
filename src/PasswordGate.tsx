import React, { useState, useEffect } from 'react';

const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessGranted');
    if (storedAccess === 'true') {
      setAccessGranted(true);
    }
  }, []);

  const handlePassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value === 'fayna2025') {
      setAccessGranted(true);
      localStorage.setItem('accessGranted', 'true');
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
        background: '#fff',
        color: '#111',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1>🔒 Сайт захищено</h1>
        <input
          type="password"
          placeholder="Введіть пароль"
          onKeyDown={handlePassword}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordGate;
