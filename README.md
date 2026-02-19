[![codecov](https://codecov.io/gh/tarektarho/weather-forecast-app-v2/branch/main/graph/badge.svg?token=dLe5v8Gm4V)](https://codecov.io/gh/tarektarho/weather-forecast-app-v2)
[![Build and Test](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/main.yml/badge.svg)](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/main.yml)
[![Deploy to GitHub Pages](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/deploy.yml/badge.svg)](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/deploy.yml)

# WeatherForecastApp

## Live Demo

- **GitHub Pages:** https://tarektarho.github.io/weather-forecast-app-v2/
- **Netlify:** https://tarek-weather-forecast-app.netlify.app/

Built with [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Redux Toolkit](https://redux-toolkit.js.org/) with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), [React Router 7](https://reactrouter.com/), [Vite 7](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [React Testing Library](https://github.com/testing-library/react-testing-library). Uses the [OpenWeather API](https://openweathermap.org/) for weather data.

Leverages React 19 features including the **React Compiler** (via `babel-plugin-react-compiler`), document metadata support (`<title>` / `<meta>` rendered directly in components for SEO), and modern hooks.

![weather-forecast-app](https://github.com/tarektarho/weather-forecast-app/assets/18512695/890af764-a13f-4dc4-adc4-c456785029b7)

## Goals

- Create a user-friendly and feature-rich weather forecast application
- Provide accurate and detailed weather information for different cities
- Build a robust solution using React, TypeScript, Redux, and API integration

## Features

- Display weather forecast based on the user's current latitude and longitude (Geolocation API)
- Search weather forecast by city name with **RTK Query caching** — repeated searches for the same city are served instantly from cache
- 5-day / 3-hour weather forecast with clickable **forecast detail page** (temperature, wind, atmosphere, conditions)
- Air pollution data based on geolocation (geocodes city → lat/lon when searching by city)
- Share current location weather with friends via URL (copies shareable link to clipboard)
- Additional weather details: wind speed, pressure, humidity, sunrise/sunset, and more
- Welcome modal for first-time visitors (remembered via localStorage)
- Error boundary for graceful crash recovery
- Skeleton loading states while data is being fetched
- React 19 document metadata — dynamic `<title>` and `<meta description>` based on current weather
- Location resolution priority: URL params → localStorage → browser Geolocation API

## Architecture

All API data fetching is handled by **RTK Query** (`@reduxjs/toolkit/query/react`). A single `baseApi` instance is created with `createApi` and endpoints are injected via `injectEndpoints()` for weather, forecast, and air pollution data.

### RTK Query & Caching Strategy

- **Centralized API layer** — A shared `baseApi` with a custom `baseQuery` that auto-appends the API key and normalizes errors.
- **Automatic caching** — Query results are cached and keyed by coordinates (`lat,lon`) or lowercase city name. Searching for the same city again returns cached data without a network request.
- **Per-endpoint cache TTLs** — Weather data is cached for **10 minutes** (`keepUnusedDataFor: 600`); forecast and air pollution data are cached for **30 minutes** (`keepUnusedDataFor: 1800`), balancing freshness with performance.
- **Cache tags** — Three tag types (`Weather`, `Forecast`, `AirPollution`) enable granular cache invalidation when needed.
- **Dual-mode querying** — The `WeatherProvider` declares six RTK Query hooks (3 by lat/lon, 3 by city) and uses `skip` to activate only the relevant set, ensuring seamless switching between geolocation and city search.
- **Two-step geocoding for air pollution** — The air-pollution-by-city endpoint uses a `queryFn` that first geocodes the city name via the OpenWeather Geocoding API, then fetches air pollution data with the resolved coordinates.
- **Code-split endpoints** — Each API domain (weather, forecast, air pollution) injects its own endpoints, keeping the codebase modular while sharing a single cache store.

### Build Optimizations

- **CSS inlining** — A custom Vite plugin inlines all CSS into `<style>` tags in the HTML, eliminating the CSS file from the critical request chain.
- **Image optimization** — `vite-plugin-image-optimizer` compresses PNG, JPEG, and WebP assets at build time.
- **Manual chunk splitting** — Vendor (`react`, `react-dom`, `react-router-dom`) and Redux (`@reduxjs/toolkit`, `react-redux`) are split into separate chunks for better caching.
- **SPA routing on GitHub Pages** — `index.html` is copied to `404.html` during the deploy workflow so that client-side routes work on refresh.

## Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `pnpm dev`        | Start development server            |
| `pnpm build`      | Type-check and build for production |
| `pnpm preview`    | Preview production build locally    |
| `pnpm test`       | Run tests in watch mode             |
| `pnpm coverage`   | Run tests with coverage report      |
| `pnpm lint`       | Lint source files with ESLint       |
| `pnpm lint:fix`   | Lint and auto-fix issues            |
| `pnpm format`     | Format code with Prettier           |
| `pnpm type-check` | Run TypeScript type checking        |

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 10 (`corepack enable && corepack prepare pnpm@latest --activate`)

## Project Setup

1. Clone the repo:

   ```sh
   git clone https://github.com/tarektarho/weather-forecast-app-v2.git
   ```

2. Install dependencies:

   ```sh
   cd weather-forecast-app-v2
   pnpm install
   ```

3. Get your API key and configure the environment:
   - Sign up at [OpenWeather](https://home.openweathermap.org/users/sign_up) to get a free API key
   - Copy the example env file and create a local override:

     ```sh
     cp .env.example .env.local
     ```

   - Open `.env.local` and replace `your_api_key_here` with your actual API key:

     ```
     VITE_WEATHER_API_KEY=your_api_key_here
     ```

   > `.env.local` is git-ignored by default in Vite projects and is the recommended place for secrets during local development. See the [Vite Env docs](https://vite.dev/guide/env-and-mode.html) for the full loading order.

4. Start the dev server:

   ```sh
   pnpm dev
   ```

5. Run tests:

   ```sh
   pnpm test
   ```

> **Note:** If the API key is expired or missing, generate a new one at [OpenWeather Sign Up](https://home.openweathermap.org/users/sign_up) and set `VITE_WEATHER_API_KEY` in your `.env.local` file.

## Project Structure

```
src/
├── api/              # RTK Query base API, injected endpoints, tags, types
├── assets/           # Static images
├── browser/          # Browser API wrappers (clipboard, geolocation, storage, URL)
├── components/
│   ├── common/       # Shared UI (WidgetContainer, skeletons)
│   ├── ErrorBoundary/
│   ├── Modal/        # Welcome modal
│   ├── Notification/ # Error & info toast notifications
│   ├── Search/       # City search bar
│   └── widgets/      # CurrentWidget, DailyWidget, AdditionalWidget, AirPollutionWidget, DailyDetail
├── features/
│   ├── api/services/ # Position storage, share-link helpers
│   └── weather/      # weatherUi Redux slice (client-side UI state)
├── pages/
│   ├── Dashboard/    # Main page with all widgets
│   └── ForecastDetail/ # Detailed view for a single forecast entry
├── providers/        # WeatherContext & WeatherProvider (data layer)
├── routes/           # Centralised route definitions
├── store/            # Redux store configuration
├── styles/           # Global SCSS variables, colors, shared modules
├── types/            # TypeScript interfaces (weather, forecast, airPollution)
└── utils/            # Constants, date helpers, geo validation, temperature conversion
```

## Dependencies

### Runtime

- **@reduxjs/toolkit** — Redux state management with RTK Query for data fetching and caching
- **react** / **react-dom** — React 19 for building user interfaces
- **react-redux** — Official React bindings for Redux
- **react-router-dom** — Client-side routing (v7)
- **sass** — CSS preprocessor for organized styles

### Development

- **vite** / **@vitejs/plugin-react** — Fast build tool, dev server, and React plugin
- **vite-plugin-image-optimizer** / **sharp** — Build-time image compression
- **typescript** — Static type checking
- **vitest** / **vitest-fetch-mock** / **@vitest/coverage-v8** — Testing framework with fetch mocking and v8 coverage
- **@testing-library/react** / **dom** / **jest-dom** / **user-event** — Component testing utilities
- **cross-fetch** — Consistent fetch API for test environments
- **eslint** / **@typescript-eslint** / **eslint-plugin-react** / **react-hooks** / **react-refresh** / **testing-library** / **prettier** — Linting and formatting
- **babel-plugin-react-compiler** — React Compiler integration
- **prettier** / **prettier-config-nick** — Code formatting
- **jsdom** — DOM implementation for testing

## CI/CD

- **Build and Test** (`main.yml`) — Runs on push to `main` and PRs: lint, type-check, build, test with coverage, and Codecov upload (Node.js 22, pnpm)
- **Deploy to GitHub Pages** (`deploy.yml`) — Triggers on published releases; builds the app, copies `index.html` → `404.html` for SPA routing, and deploys via GitHub Pages
- **Dependency Review** — Scans PRs for vulnerable or malicious dependency changes (fails on high/critical severity)

## Todos

- [ ] Internationalization (i18n)
- [ ] Dark/Light Mode
