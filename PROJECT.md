# Cryptocurrency Tracking Web Application

## Project Overview

This project is a mobile-first cryptocurrency statistics website that allows users to view cryptocurrency exchange rate and volume data. The application includes an administration panel where administrators can configure which cryptocurrencies are displayed to users.

The application displays real-time and historical cryptocurrency data including:

- Current price
- Price change percentages (1H, 24H, 7D, 30D, 90D)
- Trading volume
- Interactive price charts

## Technology Stack

- **Backend**: PHP 8.2 with Laravel 12.x
- **Frontend**: Next.js 14 with TypeScript
- **CSS Framework**: Bootstrap 5
- **Database**: MySQL 8.0 (via Docker)
- **API**: CoinMarketCap API for cryptocurrency data
- **Authentication**: Laravel Sanctum for API authentication
- **Containerization**: Docker & Docker Compose

## Key Features

### Public Area (Next.js Frontend)

- Mobile-first responsive design
- Real-time cryptocurrency prices with color-coded indicators
- Interactive price charts and historical data
- User authentication and watchlist functionality
  - Dark/light mode toggle

### Admin Panel (Laravel Backend)

- Cryptocurrency management (blacklist/whitelist)
- User management with role-based permissions
- System settings and API configuration

## Architecture

The application follows a decoupled architecture:

1. **Laravel Backend**: Provides RESTful API endpoints
2. **Next.js Frontend**: Consumes the API and renders the UI
3. **MySQL Database**: Stores application data

## Development Workflow

1. **Setup Development Environment**

   - Install required dependencies
   - Configure environment variables
   - Start development servers

2. **Development Process**

   - Follow mobile-first design approach
   - Implement backend API endpoints
   - Develop frontend components
   - Integrate backend and frontend

3. **Deployment**
   - Use Docker Compose for containerized deployment
   - Configure production environment
   - Monitor application performance

## Current Development Status

Please check [TODOS.md](TODOS.md) for the current development status and upcoming features.

## License

MIT License
