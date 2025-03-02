# Cryptocurrency Tracking App - Backend

Laravel 12.x backend for the Cryptocurrency Tracking App that provides API endpoints for cryptocurrency data and user management.

## Features

-   RESTful API for cryptocurrency data
-   User authentication with Laravel Sanctum
-   Admin panel for cryptocurrency and user management
-   Integration with CoinMarketCap API
-   Scheduled tasks for data updates

## Development Setup

1. Install dependencies:

    ```bash
    composer install
    ```

2. Configure environment:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. Update `.env` with your database credentials and CoinMarketCap API key.

4. Run database from docker compose (optional for development):

    ```bash
    cd ../
    docker compose up -d db
    ```

5. Run migrations and seeders:

    ```bash
    php artisan migrate --seed
    ```

6. Start the development server:

    ```bash
    composer run dev
    ```

7. Set up the cron job for cryptocurrency data updates (optional for development):

    ```bash
    ./add-crypto-fetch-cron.sh
    ```

## Docker Deployment (Production)

If you prefer using Docker for deployment:

1. From the project root, start all services:

    ```bash
    docker compose up -d
    ```

2. The application will automatically:
    - Run database migrations and seeders
    - Start the Apache web server
    - Run scheduled tasks via cron
    - Process queued jobs via Laravel worker

## Cron Jobs

The application includes the following scheduled tasks:

1. **Cryptocurrency Data Fetching**: Runs hourly to fetch and store the latest cryptocurrency data from CoinMarketCap API.

    ```bash
    # Manual execution
    docker compose exec backend php artisan app:fetch-cryptocurrency-data --limit=100
    ```

2. **Laravel Scheduler**: Runs every minute to execute any scheduled tasks defined in `app/Console/Kernel.php`.

## API Endpoints

-   `GET /api/cryptocurrencies/top` - Get top cryptocurrencies
-   `GET /api/cryptocurrencies/trending` - Get trending cryptocurrencies
-   `GET /api/cryptocurrencies/search` - Search cryptocurrencies
-   `GET /api/cryptocurrencies/{symbol}` - Get cryptocurrency details
-   `GET /api/health` - Health check endpoint

For authentication and admin endpoints, see the API documentation.

## License

MIT License
