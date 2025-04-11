'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Auth error:', error);
  }, [error]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2 style={{ fontSize: '20px', color: '#ef4444', marginBottom: '16px' }}>
        Ошибка авторизации
      </h2>
      <p style={{ marginBottom: '16px' }}>{error.message}</p>
      <button 
        onClick={() => router.push('/login')}
        style={{ 
          background: '#3b82f6', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Вернуться на страницу входа
      </button>
    </div>
  );
}