# Cryptocurrency Tracking App - Frontend

Next.js frontend for the Cryptocurrency Tracking App that provides a user interface for viewing cryptocurrency data.

## Features

- Real-time cryptocurrency price tracking
- Interactive price charts using Chart.js
- Responsive design with Bootstrap
- User authentication
- Watchlist functionality
- Dark/light mode toggle

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp example.env .env
   ```

3. Update `.env` with your backend API URL:

   ```
   # For local development
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the frontend at http://localhost:3000

## Docker Environment Configuration

When running in Docker, the frontend needs two different API URLs:

1. **Server-side rendering (SSR)**: The Next.js server needs to communicate with the backend using the Docker network:

   ```
   SERVER_API_URL=http://backend:80/api
   ```

2. **Client-side rendering (CSR)**: The browser needs to access the backend through the exposed port:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

The docker-compose.yml file already sets these environment variables correctly.

## Building for Production

1. Create a production build:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Docker Deployment (Production)

If you prefer using Docker for deployment:

1. From the project root, start all services:

   ```bash
   docker compose up -d
   ```

2. Access the frontend at http://localhost:3000

## Main Pages

- `/` - Home page with top cryptocurrencies
- `/cryptocurrencies` - List of all cryptocurrencies
- `/cryptocurrencies/[symbol]` - Detailed view of a cryptocurrency
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/watchlists` - User's watchlists

## License

MIT License
