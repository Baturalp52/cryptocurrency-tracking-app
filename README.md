# Cryptocurrency Tracking App

A mobile-first cryptocurrency statistics website built with Laravel (backend) and Next.js with Bootstrap (frontend) that displays real-time cryptocurrency data from CoinMarketCap API.

## Features

- Real-time cryptocurrency price tracking
- Historical price data with interactive charts
- Price change percentages (1H, 24H, 7D, 30D, 90D)
- Trading volume information
- Mobile-first responsive design
- Admin panel for cryptocurrency management
- User authentication and authorization

## Technology Stack

- **Backend**: PHP 8.x with Laravel 10.x
- **Frontend**: Next.js 14 with TypeScript
- **CSS Framework**: Bootstrap 5
- **Database**: MySQL 8.0 (via Docker)
- **API**: CoinMarketCap API for cryptocurrency data
- **Authentication**: Laravel Sanctum for API authentication

## Requirements

- PHP 8.0 or higher
- Composer
- Node.js 22+ and NPM
- Docker and Docker Compose
- CoinMarketCap API key

## Installation

### Backend Setup (Laravel)

1. Clone the repository:

   ```
   git clone https://github.com/Baturalp52/cryptocurrency-tracking-app.git
   cd cryptocurrency-tracking-app
   cd backend
   ```

2. Copy the environment file and configure it:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file and add your CoinMarketCap API key and database credentials.

3. Start the database using Docker Compose:

   ```
   cd cryptocurrency-tracking-app
   docker-compose up -d
   ```

4. Install PHP dependencies:

   ```
   composer install
   ```

5. Generate application key:

   ```
   php artisan key:generate
   ```

6. Run database migrations and seeders:

   ```
   php artisan migrate --seed
   ```

7. Start the Laravel development server:

   ```
   composer run dev
   ```

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install NPM dependencies:

   ```
   npm install
   ```

3. Copy `example.env` and create `.env` file:

   ```
   cp example.env .env
   ```

4. Start the Next.js development server:

   ```
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

## Docker Setup

The project uses Docker Compose to set up the MySQL database. The database service is defined in the `docker-compose.yml` file. To manage the Docker containers:

- Start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs`
- Rebuild containers: `docker-compose up -d --build`

## Project Structure

### Backend (Laravel)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── AdminController.php
│   │   │   └── Controller.php
│   │   ├── Models/
│   │   ├── Providers/
│   │   └── Enums/
│   ├── config/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   ├── storage/
│   └── vendor/
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── theme.css
│   ├── components/
│   ├── contexts/
│   └── services/
├── public/
└── node_modules/
```

## API Integration

This application uses the CoinMarketCap API to fetch cryptocurrency data. You'll need to obtain an API key from [CoinMarketCap](https://coinmarketcap.com/api/) and add it to your `.env` file.

## Current Development Status

Please check [TODOS.md](TODOS.md) for the current development status and upcoming features.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Acknowledgments

- [Laravel](https://laravel.com/) for the PHP framework
- [Next.js](https://nextjs.org/) for the React framework
- [CoinMarketCap](https://coinmarketcap.com/) for providing the cryptocurrency data API
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework
