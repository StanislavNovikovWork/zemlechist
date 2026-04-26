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
│   │       ├── route.ts        # GET /api/markers, POST /api/markers
│   │       └── [id]/           # PUT /api/markers/:id, DELETE /api/markers/:id
│   ├── maps/                   # Страница карты
│   │   └── page.tsx
│   ├── layout.tsx              # Корневой layout
│   ├── page.tsx                # Главная страница
│   └── globals.css             # Глобальные стили
├── ui/                         # Общие UI компоненты
│   ├── AppDrawer/              # Drawer компонент
│   ├── Button.tsx              # Кнопка
│   ├── Card.tsx                # Карточка
│   ├── Input.tsx               # Поле ввода
│   └── PhoneInput/             # Поле ввода телефона
├── layout/                     # Layout компоненты
│   ├── AppLayout.tsx           # Основной layout с sidebar
│   ├── Footer.tsx              # Подвал
│   └── Header.tsx              # Шапка
├── providers/                  # Провайдеры
│   └── QueryProvider.tsx      # React Query провайдер
├── icons/                      # Иконки
│   ├── CarMarker.tsx           # Иконка маркера спецтехники
│   └── TrashMarker.tsx         # Иконка маркера мусора
├── store/                      # Глобальные Zustand stores
│   └── addMarkerDrawerStore.ts # Store для управления drawer добавления маркера
├── features/                   # Feature-based структура
│   ├── AddMarkerDrawer/        # Глобальная фича добавления маркера
│   │   ├── components/         # Компоненты фичи
│   │   │   ├── AddMarkerDrawer/      # Drawer для добавления маркера
│   │   │   ├── AddMarkerDrawerWrapper.tsx # Обертка для глобального рендеринга
│   │   │   └── AddMarkerForm/         # Форма добавления маркера
│   │   ├── hooks/              # Хуки фичи
│   │   │   ├── useAddMarkerDrawer.tsx # Хук для управления drawer
│   │   │   └── mutations/      # Мутации
│   │   │       └── useCreateMarkerMutation.ts
│   └── Map/                    # Feature карты
│       ├── index.tsx           # Основной компонент карты
│       ├── components/         # Компоненты карты
│       │   ├── FilterSidebar/         # Боковая панель с фильтрами
│       │   ├── MapContent/            # Контент карты с маркерами
│       │   ├── MapSearch/             # Поиск по карте
│       │   ├── Marker/                # Компонент маркера
│       │   ├── MarkerEditForm/        # Форма редактирования маркера
│       │   └── MarkerPopup/           # Всплывающее окно маркера
│       ├── hooks/              # React Query хуки для Map
│       │   ├── queries/        # GET запросы
│       │   │   └── useMarkersQuery.ts
│       │   ├── mutations/      # POST/PUT/DELETE
│       │   │   ├── useDeleteMarkerMutation.ts
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

