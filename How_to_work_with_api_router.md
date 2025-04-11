# API Routes в Next.js

Этот проект использует API-роуты Next.js для обработки запросов и отправки данных в формате JSON.

## Структура проекта

API-роуты создаются в папке `app/api/.../route.ts`.

Пример структуры:
`/app /api/hello/route.ts <-- твой API-роут`

## Как работает API-роут?

В файле `app/api/hello/route.ts` описан API-роут, который обрабатывает **GET-запросы** и возвращает JSON-ответ.

```ts
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello from API!' });
}
```
### Что делает этот код:

- Обрабатывает **GET-запрос** на `/api/hello`.
    
- Возвращает ответ в формате JSON:
`{ "message": "Hello from API!" }`

## Как протестировать?

1. Запусти проект:
```sh
npm run dev
```
2. Перейди в браузер по адресу:
```http
http://localhost:3000/api/hello
```
3. Ты увидишь JSON-ответ:
```json
{ "message": "Hello from API!" }
```

## Добавление POST-запроса
Если нужно обработать **POST-запрос**, добавь следующий код:

```ts
export async function POST(req: Request) {
    const data = await req.json();
    return NextResponse.json({ received: data });
}
```
Теперь можно отправлять данные на `/api/hello` через POST-запрос, и они будут возвращены обратно в ответе.
