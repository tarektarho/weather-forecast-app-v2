[![codecov](https://codecov.io/gh/tarektarho/weather-forecast-app-v2/branch/main/graph/badge.svg?token=dLe5v8Gm4V)](https://codecov.io/gh/tarektarho/weather-forecast-app-v2)
[![Deploy to GitHub Pages](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/deploy.yml/badge.svg)](https://github.com/tarektarho/weather-forecast-app-v2/actions/workflows/deploy.yml)

# WeatherForecastApp

## Live Demo

https://tarek-weather-forecast-app.netlify.app/

Built with [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Redux Toolkit](https://redux-toolkit.js.org/) with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [React Testing Library](https://github.com/testing-library/react-testing-library). Uses the [OpenWeather API](https://openweathermap.org/) for weather data.

Leverages React 19 features including the React Compiler, `useOptimistic`, `useActionState`, and document metadata support.

![weather-forecast-app](https://github.com/tarektarho/weather-forecast-app/assets/18512695/890af764-a13f-4dc4-adc4-c456785029b7)

## Goals

- Create a user-friendly and feature-rich weather forecast application
- Provide accurate and detailed weather information for different cities
- Build a robust solution using React, TypeScript, Redux, and API integration

## Features

- Display weather forecast based on the user's current latitude and longitude (Geolocation API)
- Search weather forecast by city name with **RTK Query caching** — repeated searches for the same city are served instantly from cache
- 5-day / 3-hour weather forecast
- Air pollution data based on geolocation
- Share current location weather with friends via URL
- Additional weather details: wind speed, pressure, humidity, and more

## Architecture

All API data fetching is handled by **RTK Query** (`@reduxjs/toolkit/query/react`). A single `baseApi` instance is created with `createApi` and endpoints are injected via `injectEndpoints()` for weather, forecast, and air pollution data.

### RTK Query & Caching Strategy

- **Centralized API layer** — A shared `baseApi` with a custom `baseQuery` that auto-appends the API key and normalizes errors.
- **Automatic caching** — Query results are cached and keyed by coordinates (`lat,lon`) or lowercase city name. Searching for the same city again returns cached data without a network request.
- **5-minute cache TTL** — Unused cache entries are kept for 300 seconds (`keepUnusedDataFor: 300`), balancing freshness with performance.
- **Cache tags** — Three tag types (`Weather`, `Forecast`, `AirPollution`) enable granular cache invalidation when needed.
- **Dual-mode querying** — The `WeatherProvider` declares six RTK Query hooks (3 by lat/lon, 3 by city) and uses `skip` to activate only the relevant set, ensuring seamless switching between geolocation and city search.
- **Code-split endpoints** — Each API domain (weather, forecast, air pollution) injects its own endpoints, keeping the codebase modular while sharing a single cache store.

## Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `pnpm dev`        | Start development server            |
| `pnpm build`      | Type-check and build for production |
| `pnpm preview`    | Preview production build locally    |
| `pnpm test`       | Run tests in watch mode             |
| `pnpm coverage`   | Run tests with coverage report      |
| `pnpm lint`       | Lint source files with ESLint       |
| `pnpm format`     | Format code with Prettier           |
| `pnpm type-check` | Run TypeScript type checking        |

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
   - Copy the example env file and add your key:

     ```sh
     cp .env.example .env
     ```

   - Open `.env` and replace `your_api_key_here` with your actual API key:

     ```
     VITE_WEATHER_API_KEY=your_api_key_here
     ```

4. Start the dev server:

   ```sh
   pnpm dev
   ```

5. Run tests:

   ```sh
   pnpm test
   ```

> **Note:** If the API key is expired or missing, generate a new one at [OpenWeather Sign Up](https://home.openweathermap.org/users/sign_up) and set `VITE_WEATHER_API_KEY` in your environment.

## Dependencies

### Runtime

- **@reduxjs/toolkit** — Redux state management with RTK Query for data fetching and caching
- **react** / **react-dom** — React 19 for building user interfaces
- **react-redux** — Official React bindings for Redux
- **react-router-dom** — Client-side routing
- **cross-fetch** — Consistent fetch API across environments
- **sass** — CSS preprocessor for organized styles

### Development

- **vite** — Fast build tool and dev server
- **typescript** — Static type checking
- **vitest** / **vitest-fetch-mock** / **@vitest/coverage-v8** — Testing framework with fetch mocking and v8 coverage
- **@testing-library/react** / **dom** / **jest-dom** / **user-event** — Component testing utilities
- **eslint** / **@typescript-eslint** / **eslint-plugin-react** / **react-hooks** / **react-refresh** / **react-compiler** / **testing-library** / **prettier** — Linting and formatting
- **babel-plugin-react-compiler** — React Compiler integration
- **prettier** / **prettier-config-nick** — Code formatting
- **jsdom** — DOM implementation for testing
- **@vitejs/plugin-react** — Vite React plugin

## CI/CD

- **Build and Test** — Runs on push to `main` and PRs: lint, type-check, build, test with coverage, and Codecov upload
- **Dependency Review** — Scans PRs for vulnerable or malicious dependency changes

## Todos

- [ ] Internationalization (i18n)
- [ ] Dark/Light Mode
- [ ] Split styles per component
- [x] Store the API key in GitHub secrets
- [x] Add CI pipeline with lint, type-check, build, and test
- [x] Add dependency review for PRs
