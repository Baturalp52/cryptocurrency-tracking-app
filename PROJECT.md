# Cryptocurrency Tracking Web Application

## Project Overview

This project is a mobile-first cryptocurrency statistics website that allows users to view cryptocurrency exchange rate and volume data. The application includes an administration panel where administrators can configure which cryptocurrencies are displayed to users.

The application displays real-time and historical cryptocurrency data including:

- Current price
- Price change percentages (1H, 24H, 7D, 30D, 90D)
- Trading volume
- Interactive price charts

## Technology Stack

- **Backend**: PHP 8.x with Laravel 10.x
- **Frontend**: Next.js 14 with TypeScript
- **CSS Framework**: Bootstrap 5
- **Database**: MySQL 8.0 (via Docker)
- **API**: CoinMarketCap API for cryptocurrency data
- **Authentication**: Laravel Sanctum for API authentication
- **Package Manager**: Composer (PHP), NPM (JavaScript)
- **Version Control**: Git
- **Containerization**: Docker & Docker Compose

## Project Structure

```
cryptocurrency-tracking-app/
├── backend/                 # Laravel application code
│   ├── app/                 # Laravel application code
│   │   ├── Http/            # Controllers, Middleware, Requests
│   │   │   ├── Controllers/ # Controller classes
│   │   │   │   ├── Auth/    # Authentication controllers
│   │   │   │   ├── AdminController.php
│   │   │   │   └── Controller.php
│   │   ├── Models/          # Eloquent models
│   │   ├── Providers/       # Service providers
│   │   └── Enums/           # Enumeration classes
│   ├── config/              # Configuration files
│   ├── database/            # Database migrations and seeds
│   │   └── migrations/      # Database migrations
│   ├── routes/              # Route definitions
│   ├── storage/             # Storage directory
│   └── vendor/              # Composer dependencies
├── frontend/                # Next.js frontend application
│   ├── src/                 # Source code
│   │   ├── app/             # Next.js app directory
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── layout.tsx   # Main layout component
│   │   │   ├── page.tsx     # Main page component
│   │   │   ├── globals.css  # Global CSS
│   │   │   └── theme.css    # Theme CSS
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   ├── public/              # Static assets
│   └── node_modules/        # NPM dependencies
├── docker-compose.yml       # Docker Compose configuration
├── TODOS.md                 # Development tasks and progress
└── README.md                # Project documentation
```

## Key Features

### Public Area (Next.js Frontend)

1. **Dashboard**

   - Mobile-first responsive design
   - Real-time cryptocurrency prices
   - Price change indicators with color coding
   - Trading volume information
   - Interactive price charts

2. **Cryptocurrency Details**

   - Detailed view of individual cryptocurrencies
   - Historical price data
   - Advanced charts and statistics

3. **User Preferences**
   - Ability to favorite/watch specific cryptocurrencies
   - Customizable dashboard layout
   - Dark/light mode toggle

### Admin Panel (Laravel Backend)

1. **Cryptocurrency Management**

   - Add/remove cryptocurrencies to be displayed
   - Configure display options for each cryptocurrency
   - Set update frequency

2. **User Management**

   - Create/edit/delete admin users
   - Assign roles and permissions

3. **System Settings**
   - Configure API settings
   - Set caching parameters
   - Manage database operations

## Architecture

The application follows a decoupled architecture:

1. **Laravel Backend**: Provides RESTful API endpoints for the frontend to consume
2. **Next.js Frontend**: Consumes the Laravel API and renders the user interface
3. **MySQL Database**: Stores cryptocurrency data, user information, and application settings

## API Integration

The application uses the CoinMarketCap API to fetch cryptocurrency data. Key endpoints include:

1. `/v1/cryptocurrency/listings/latest` - Get latest cryptocurrency listings
2. `/v1/cryptocurrency/quotes/latest` - Get latest quotes for specific cryptocurrencies
3. `/v1/cryptocurrency/info` - Get metadata for cryptocurrencies

API requests are cached to minimize API usage and improve performance. Laravel's built-in caching system is utilized for this purpose.

## Docker Setup

The project uses Docker and Docker Compose to set up the development environment, particularly for the database. The `docker-compose.yml` file defines:

- MySQL database service with version 8.0
- Volume mapping for data persistence

This approach ensures consistent development environments across different machines and simplifies the setup process.

## Database Schema

### Users Table

```
id: integer (primary key)
name: string
email: string
password: string (hashed)
remember_token: string
role: string (admin, user)
created_at: timestamp
updated_at: timestamp
```

### Watchlists Table

```
id: integer (primary key)
user_id: integer (foreign key to users.id)
name: string
is_default: boolean (default: false)
description: text (nullable)
created_at: timestamp
updated_at: timestamp
```

### Watchlist Cryptocurrencies Table

```
id: integer (primary key)
watchlist_id: integer (foreign key to watchlists.id)
symbol: string
name: string
cmc_id: integer (nullable) - CoinMarketCap ID for direct API reference
added_at: timestamp
notes: text (nullable)
created_at: timestamp
updated_at: timestamp
```

Additional tables for cryptocurrency data will be implemented as the project progresses.

## Implementation Details

### Data Fetching Strategy

- Initial data load from CoinMarketCap API
- Regular background updates using Laravel Scheduler
- Caching layer to reduce API calls and improve performance
- Fallback mechanisms for API outages

### Frontend Implementation

- Next.js 14 for server-side rendering and static site generation
- React hooks for state management
- Bootstrap 5 for responsive UI components
- TypeScript for type safety
- Context API for state management

### Security Considerations

- Secure API key storage in environment variables
- Laravel's built-in CSRF protection
- Form validation using Laravel's validation system
- Password hashing with Laravel's authentication system
- Laravel Sanctum for API authentication

### Performance Optimization

- Database indexing for frequently queried fields
- Laravel's built-in caching system
- Next.js static generation for faster page loads
- Code splitting and lazy loading in Next.js

## Development Workflow

1. **Setup Development Environment**

   - Install PHP 8.x
   - Install Node.js 22+ and NPM
   - Install Docker and Docker Compose
   - Start database with Docker Compose
   - Install Composer dependencies for Laravel backend
   - Install NPM dependencies for Next.js frontend

2. **Development Process**

   - Follow mobile-first design approach
   - Implement backend API endpoints with Laravel
   - Develop frontend components with Next.js and Bootstrap
   - Integrate backend and frontend

3. **Deployment**
   - Set up staging environment
   - Perform final testing
   - Deploy Laravel backend to server
   - Deploy Next.js frontend to Vercel or similar platform
   - Monitor for issues

## Current Development Status

Please check [TODOS.md](TODOS.md) for the current development status and upcoming features.

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/)

## License

MIT License
