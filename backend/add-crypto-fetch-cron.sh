#!/bin/bash

# Get the absolute path to the Laravel project
PROJECT_PATH=$(cd "$(dirname "$0")" && pwd)

# Try to find PHP path in multiple ways
PHP_PATH="/home/baturalp/.config/herd-lite/bin/php"

# If the hardcoded path doesn't exist, try to find PHP using the current user's which
if [ ! -f "$PHP_PATH" ]; then
  # Get the current user
  CURRENT_USER=$(logname)
  
  # Try to get PHP path from the current user's environment
  USER_PHP_PATH=$(sudo -u $CURRENT_USER which php 2>/dev/null)
  
  if [ -n "$USER_PHP_PATH" ] && [ -f "$USER_PHP_PATH" ]; then
    PHP_PATH=$USER_PHP_PATH
  else
    # Try common PHP locations
    for path in "/usr/bin/php" "/usr/local/bin/php" "/opt/homebrew/bin/php"; do
      if [ -f "$path" ]; then
        PHP_PATH=$path
        break
      fi
    done
  fi
fi

# Final check if PHP exists
if [ ! -f "$PHP_PATH" ]; then
  echo "PHP not found. Please edit this script and update the PHP_PATH variable with the correct path to your PHP executable"
  exit 1
fi

# Check if the script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo to modify crontab"
  exit 1
fi

# Get the current user
CURRENT_USER=$(logname)

# Ensure the storage directory has proper permissions
STORAGE_DIR="$PROJECT_PATH/storage"

# Ensure the logs directory exists
LOG_DIR="$PROJECT_PATH/storage/logs"
if [ ! -d "$LOG_DIR" ]; then
  echo "Creating logs directory at $LOG_DIR"
  mkdir -p "$LOG_DIR"
  # Set proper permissions
  chmod -R 775 "$LOG_DIR"
  chown -R $CURRENT_USER:$CURRENT_USER "$LOG_DIR"
fi

# Create a temporary file for the crontab
TEMP_CRONTAB=$(mktemp)

# Export the current crontab to the temporary file
crontab -u $CURRENT_USER -l > $TEMP_CRONTAB 2>/dev/null || echo "" > $TEMP_CRONTAB

# Check if the cron job already exists
if grep -q "app:fetch-cryptocurrency-data" $TEMP_CRONTAB; then
  echo "Cron job for cryptocurrency data fetching already exists"
  rm $TEMP_CRONTAB
  exit 0
fi

# Get the PATH environment variable
USER_PATH=$PATH

# Add the cron job to run every minute with environment variables
echo "# Cryptocurrency data fetching - added on $(date)" >> $TEMP_CRONTAB
echo "SHELL=/bin/bash" >> $TEMP_CRONTAB
echo "PATH=$USER_PATH" >> $TEMP_CRONTAB
echo "* * * * * cd $PROJECT_PATH && $PHP_PATH artisan app:fetch-cryptocurrency-data --limit=100 >> $PROJECT_PATH/storage/logs/crypto-fetch.log 2>&1" >> $TEMP_CRONTAB

# Install the new crontab
crontab -u $CURRENT_USER $TEMP_CRONTAB

# Clean up
rm $TEMP_CRONTAB

echo "Cryptocurrency data fetching cron job has been added successfully"
echo "The command will run every minute and log output to $PROJECT_PATH/storage/logs/crypto-fetch.log"
echo "Using PHP at: $PHP_PATH"
echo ""
echo "To test the command directly without cron, run: sudo $0 --test" 