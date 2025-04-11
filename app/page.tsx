
"use client";

import { useEffect, useState } from 'react';
import NavBar from '../components/ui/blocks/NavBar';
import MapWrapper from '../components/ui/blocks/MapWrapper';
export default function HomePage() {


  return (
    <div>
      <NavBar/>
      <MapWrapper></MapWrapper>
    </div>
  );
}
// app/page.tsx

// import AuthButtons from "./components/AuthButtons"; // Импортируем наш компонент

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
//         {/* Вставляем компонент с кнопками */}
//         <AuthButtons />
//       </div>

//       {/* Остальной контент твоей главной страницы... */}
//       {/* ... */}
//     </main>
//   );

// }