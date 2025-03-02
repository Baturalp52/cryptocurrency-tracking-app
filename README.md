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

- **Backend**: PHP 8.2 with Laravel 12.x
- **Frontend**: Next.js 14 with TypeScript
- **CSS Framework**: Bootstrap 5
- **Database**: MySQL 8.0 (via Docker)
- **API**: CoinMarketCap API for cryptocurrency data
- **Authentication**: Laravel Sanctum for API authentication

## Requirements

- Docker and Docker Compose
- CoinMarketCap API key

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/Baturalp52/cryptocurrency-tracking-app.git
   cd cryptocurrency-tracking-app
   ```

2. Configure environment files:

   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/example.env frontend/.env
   ```

3. Update the `.env` files with your CoinMarketCap API key and other settings.

4. Start the application:

   ```bash
   docker compose up -d
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

## Documentation

- For detailed project overview, see [PROJECT.md](PROJECT.md)
- For detailed backend setup, see [backend/README.md](backend/README.md)
- For detailed frontend setup, see [frontend/README.md](frontend/README.md)

## Project Status

Check [TODOS.md](TODOS.md) for the current development status and upcoming features.

## License

MIT License

## Acknowledgments

- [Laravel](https://laravel.com/) for the PHP framework
- [Next.js](https://nextjs.org/) for the React framework
- [CoinMarketCap](https://coinmarketcap.com/) for providing the cryptocurrency data API
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework
