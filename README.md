This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Структура проекта

```
my-app/
├── app/
│   ├── api/                    # API маршруты
│   │   └── markers/            # API для маркеров
│   │       ├── route.ts        # GET /api/markers
│   │       └── [id]/           # PUT /api/markers/:id
│   ├── maps/                   # Страница карты
│   │   └── page.tsx
│   ├── layout.tsx              # Корневой layout
│   ├── page.tsx                # Главная страница
│   └── globals.css             # Глобальные стили
├── components/
│   ├── layout/                 # Layout компоненты
│   │   └── AppLayout.tsx       # Основной layout с sidebar
│   ├── providers/              # React Query и другие провайдеры
│   │   └── QueryProvider.tsx
│   └── ui/                     # UI компоненты
├── features/                   # Feature-based структура
│   └── Map/                    # Feature карты
│       ├── index.tsx           # Основной компонент карты
│       ├── components/         # Компоненты карты
│       │   ├── MapSearch/      # Поиск по карте
│       │   ├── Marker/         # Компонент маркера
│       │   ├── MarkerDrawerContent/ # Контент drawer для редактирования
│       │   └── MarkerPopup/    # Всплывающее окно маркера
│       ├── hooks/              # React Query хуки для Map
│       │   ├── queries/        # GET запросы
│       │   │   └── useMarkersQuery.ts
│       │   ├── mutations/      # POST/PUT/DELETE
│       │   │   └── useUpdateMarkerMutation.ts
│       │   └── ui/             # Хуки без API (local state, effects)
│       └── types.ts            # Типы для Map
├── hooks/                      # Общие React хуки
│   ├── useDebounce.ts
│   └── useMapLocation.ts
├── lib/                        # Утилиты и интеграции
│   ├── utils.ts
│   ├── validators.ts
│   └── ymaps3.ts               # Интеграция с Яндекс Картами
├── constants/                  # Константы приложения
│   ├── app.constants.ts
│   ├── map.constants.ts
│   └── markers.json            # Исходные данные маркеров
├── config/                     # Конфигурация
│   └── env.config.ts
├── scripts/                    # Скрипты для импорта данных
│   ├── import-markers.js       # Импорт маркеров в БД
│   └── restructure-markers.js  # Реструктуризация JSON
├── CODE_STANDARDS.md           # Стандарты кода проекта
└── README.md
```

