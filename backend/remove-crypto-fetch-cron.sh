#!/bin/bash

# Get the absolute path to the Laravel project
PROJECT_PATH=$(cd "$(dirname "$0")" && pwd)

# Check if the script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo to modify crontab"
  exit 1
fi

# Get the current user
CURRENT_USER=$(logname)

# Create a temporary file for the crontab
TEMP_CRONTAB=$(mktemp)

# Export the current crontab to the temporary file
crontab -u $CURRENT_USER -l > $TEMP_CRONTAB 2>/dev/null || echo "" > $TEMP_CRONTAB

# Check if the cron job exists
if ! grep -q "app:fetch-cryptocurrency-data" $TEMP_CRONTAB; then
  echo "No cron job for cryptocurrency data fetching found"
  rm $TEMP_CRONTAB
  exit 0
fi

# Remove the cron job and any comment line above it
sed -i '/# Cryptocurrency data fetching/d' $TEMP_CRONTAB
sed -i '/app:fetch-cryptocurrency-data/d' $TEMP_CRONTAB
# Also remove environment variables if they're not used by other cron jobs
if ! grep -q "artisan" $TEMP_CRONTAB; then
  sed -i '/^SHELL=/d' $TEMP_CRONTAB
  sed -i '/^PATH=/d' $TEMP_CRONTAB
fi

# Install the new crontab
crontab -u $CURRENT_USER $TEMP_CRONTAB

# Clean up
rm $TEMP_CRONTAB

echo "Cryptocurrency data fetching cron job has been removed successfully"
echo "Log file at $PROJECT_PATH/storage/logs/crypto-fetch.log was not removed" 