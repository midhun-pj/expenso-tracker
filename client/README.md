# Expenso

A modern expense and grocery price tracking application built with React and TypeScript.

## Features

- **Expense Tracking**: Track your daily expenses with categories
- **Grocery Price Tracker**: Monitor and compare grocery prices over time
- **User Authentication**: Secure login and registration system
- **Category Management**: Organize expenses with custom categories (income/expense)
- **Theme Customization**: Personalize the app with custom themes and colors
- **Data Visualization**: View expense trends with interactive charts
- **Settings Management**: Configure app preferences and manage your account

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: CSS with Sass
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
pnpm build
```

### Lint

Run ESLint to check code quality:
```bash
pnpm lint
```

## Project Structure

```
src/
├── components/     # React components
├── store/         # Zustand state management
├── api/           # API integration
├── styles/        # CSS and styling files
└── types.ts       # TypeScript type definitions
```

## License

Private project
