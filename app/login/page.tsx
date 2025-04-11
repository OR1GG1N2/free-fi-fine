'use client';
import { signIn } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    if (isLogin) {
      // Вхід
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        window.location.href = '/';
      }
    } else {
      // Реєстрація
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Math.random().toString(36).substring(2, 9), // Генеруємо випадковий ID
            username: formData.get('username'),
            name: formData.get('username'),
            mail: formData.get('email'),
            email: formData.get('email'),
            password: formData.get('password'),
            image: avatarUrl || null, // Додаємо аватар, якщо є
          }),
        });

        if (response.ok) {
          alert('Реєстрація успішна! Тепер ви можете увійти.');
          setIsLogin(true);
          setError('');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Помилка реєстрації');
        }
      } catch (error) {
        console.error('Помилка реєстрації:', error);
        setError('Сталася помилка під час реєстрації');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {isLogin ? 'Вхід в систему' : 'Реєстрація'}
      </h1>
      {/* Кнопка Discord */}
      {/* <Button 
    onClick={() => signIn('discord')}
    style={{ 
      color: 'white', 
      padding: '10px 20px', 
      borderRadius: '4px', 
      marginBottom: '20px',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    {isLogin ? 'Увійти через Discord' : 'Зареєструватися через Discord'}
  </Button> */}

      {/* Перемикання між входом і реєстрацією */}
      <Button
        variant="link"
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginBottom: '20px' }}
      >
        {isLogin ? 'Немає акаунта? Зареєструватися' : 'Вже є акаунт? Увійти'}
      </Button>

      {/* Форма */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        {!isLogin && (
          <>
            <Input
              name="username"
              type="text"
              placeholder="Ім'я користувача"
              required
            />
            {/* <Input
              name="avatar"
              type="url"
              placeholder="Посилання на аватар (необов'язково)"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            /> */}
          </>
        )}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Пароль"
          required
          minLength={6}
        />

        {error && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <Button type="submit">
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </Button>
      </form>

      {/* Попередній перегляд аватарки при реєстрації
      {!isLogin && avatarUrl && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Попередній перегляд аватарки:</p>
          <img
            src={avatarUrl}
            alt="Аватар"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginTop: '10px',
              objectFit: 'cover'
            }}
            onError={() => setAvatarUrl('')}
          />
        </div>
      )} */}
    </div>
  );
}