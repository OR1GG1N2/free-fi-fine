// app/components/AuthButtons.tsx
"use client"; // Этот компонент будет использовать хуки, поэтому он клиентский

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link"; // Для ссылки на страницу входа по паролю

export default function AuthButtons() {
  // Получаем данные сессии и статус загрузки
  const { data: session, status } = useSession();

  // Статус может быть 'loading', 'authenticated', 'unauthenticated'
  if (status === "loading") {
    return <p>Завантаження...</p>;
  }

  // Если пользователь аутентифицирован
  if (status === "authenticated") {
    return (
      <div>
        <p>Привіт, {session.user?.email || session.user?.name}!</p>{" "}
        {/* Показываем email или имя */}
        <button
          onClick={() => signOut()} // Выход при клике
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Вийти
        </button>
      </div>
    );
  }

  // Если пользователь не аутентифицирован
  return (
    <div>
      <p>Вы не авторизувалися в систему.</p>
      <button
        onClick={() => signIn("discord")} // Вход через Discord
        style={{ marginRight: "10px", padding: "5px 10px" }}
      >
        Авторизуватися через Discord
      </button>
      {/* Пока просто кнопка-ссылка. Позже можно сделать полноценную страницу входа */}
      {/* Или можно вызвать signIn('credentials', { email, password }) из формы */}
      <Link href="/login"> {/* Предполагаем, что будет страница /login для входа по email */}
        <button style={{ padding: '5px 10px' }}>
          Авторизуватися по Email/Паролю
        </button>
      </Link>

    </div>
  );
}