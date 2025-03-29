# Portfolio Overview

## Описание проекта

Portfolio Overview — это веб-приложение для управления инвестиционным портфелем. Пользователь может добавлять активы, просматривать их текущие цены в реальном времени (через WebSocket) и анализировать изменения стоимости портфеля.


## Используемые технологии

- React + TypeScript — основа проекта

- Redux Toolkit — управление состоянием

- WebSocket (Binance API) — получение данных в реальном времени

- SCSS — стилизация

- react-window — виртуализация списка активов

- axios — запросы к API

- uuid — генерация уникальных идентификаторов


## Установка и запуск

### 1. Клонирование репозитория

```sh
git https://github.com/b1tzxrd/portfolio-overview.git
cd portfolio-overview
```

### 2. Установка зависимостей

```sh
npm install 
```

### 3. Запуск проекта

```sh
npm run dev
```
После этого приложение будет доступно по адресу http://localhost:5173/.


## Структура проекта
```sh
src/
│── assets/          # Медиафайлы и статические ресурсы
│── components/      # Компоненты UI
│── hooks/           # Кастомные хуки (useWebSocket, useRedux)
│── slice/           # Redux-slices (activesSlice,portfolioSlice)
│── store/           # Конфигурация Redux Store
│── App.tsx          # Основной компонент приложения
│── main.tsx         # Точка входа в приложение
│── config/           # BASE_URL
```