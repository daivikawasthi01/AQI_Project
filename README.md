# Air Quality Dashboard

A React + TypeScript dashboard for visualizing real-time air quality data for major European cities, powered by the [Open-Meteo Air Quality API](https://open-meteo.com/).

## Features

- City selector covering London, Paris, Berlin, Madrid, and Rome.
- Live air quality metrics pulled from the Open-Meteo API: PM10, PM2.5, carbon monoxide, nitrogen dioxide, sulphur dioxide, ozone, and the European AQI.
- Multiple chart types (line, bar, radar, and polar-area) via Chart.js / react-chartjs-2 for visualizing trends.
- Stat cards and chart cards summarizing current readings.
- Data fetching/caching handled with TanStack Query, including a manual refresh action.
- Simple demo login flow (`AuthContext`) gating access to the dashboard.
- Dark-themed, responsive UI built with Tailwind CSS.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool/dev server
- **Tailwind CSS**
- **Chart.js** / react-chartjs-2
- **TanStack Query** (`@tanstack/react-query`)
- **React Router**
- **Open-Meteo Air Quality API** (no API key required)

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

```bash
git clone https://github.com/daivikawasthi01/AQI_Project.git
cd AQI_Project
npm install
```

### Usage

```bash
npm run dev       # start the Vite dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint       # run ESLint
```

Open the local URL printed by Vite (typically `http://localhost:5173`). Log in with the demo credentials `demo` / `demo` to view the dashboard.
