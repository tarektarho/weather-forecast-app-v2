# WeatherForecastApp

## Live Demo

https://tarek-weather-forecast-app.netlify.app/

Built with [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [React Testing Library](https://github.com/testing-library/react-testing-library). Uses the [OpenWeather API](https://openweathermap.org/) for weather data.

Leverages React 19 features including the React Compiler, `useOptimistic`, `useActionState`, and document metadata support.

![weather-forecast-app](https://github.com/tarektarho/weather-forecast-app/assets/18512695/890af764-a13f-4dc4-adc4-c456785029b7)

## Goals

- Create a user-friendly and feature-rich weather forecast application
- Provide accurate and detailed weather information for different cities
- Build a robust solution using React, TypeScript, Redux, and API integration

## Features

- Display weather forecast based on the user's current latitude and longitude (Geolocation API)
- Search weather forecast by city name
- 5-day / 3-hour weather forecast
- Air pollution data based on geolocation
- Share current location weather with friends via URL
- Additional weather details: wind speed, pressure, humidity, and more

## Available Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview production build locally    |
| `npm run test`       | Run tests in watch mode             |
| `npm run coverage`   | Run tests with coverage report      |
| `npm run lint`       | Lint source files with ESLint       |
| `npm run format`     | Format code with Prettier           |
| `npm run type-check` | Run TypeScript type checking        |

## Project Setup

1. Clone the repo:

   ```sh
   git clone https://github.com/tarektarho/weather-forecast-app-v2.git
   ```

2. Install dependencies:

   ```sh
   cd weather-forecast-app-v2
   npm install
   ```

3. Start the dev server:

   ```sh
   npm run dev
   ```

4. Run tests:

   ```sh
   npm run test
   ```

> **Note:** If the API key is expired or missing, generate a new one at [OpenWeather Sign Up](https://home.openweathermap.org/users/sign_up) and set `VITE_WEATHER_API_KEY` in your environment.

## Dependencies

### Runtime

- **@reduxjs/toolkit** — Redux state management with simplified setup
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
