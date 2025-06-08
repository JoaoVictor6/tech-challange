#!/bin/bash

# Check if a number of items is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <number_of_items>"
  echo "Example: $0 10  (This will create 10 items with dynamic data)"
  exit 1
fi

NUM_ITEMS=$1
URL="localhost:3000/items?page=0&pageSize=0"

echo "Starting to create $NUM_ITEMS items with dynamic data..."
echo "---"

for i in $(seq 1 $NUM_ITEMS); do
  # Dynamic data for each item
  ITEM_NAME="${i}_NAME"
  ITEM_DESCRIPTION="${i}_DESCRIPTION"
  ITEM_IMAGE_URL="https://example.com/images/planta-azul-${i}.jpg" # Example: unique image URL per item

  # Construct the JSON data
  DATA='{
    "name": "'"$ITEM_NAME"'",
    "description": "'"$ITEM_DESCRIPTION"'",
    "imageUrl": "'"$ITEM_IMAGE_URL"'"
  }'

  echo "Making POST request for item $i:"
  echo "  Name: $ITEM_NAME"
  echo "  Description: $ITEM_DESCRIPTION"
  echo "  Image URL: $ITEM_IMAGE_URL"

  curl --location "$URL" \
       --header 'Content-Type: application/json' \
       --data "$DATA"

  echo "" # Add a newline for better readability between requests
  sleep 0.1 # Small delay to prevent overwhelming the server
done

echo "---"
echo "Finished creating $NUM_ITEMS dynamic items."
