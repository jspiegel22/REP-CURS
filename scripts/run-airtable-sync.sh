#!/bin/bash

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOGFILE="scripts/logs/airtable-sync-$TIMESTAMP.log"

echo "Starting Airtable sync at $(date)"
echo "Log will be saved to $LOGFILE"

# Run the sync script and log output
tsx scripts/sync-to-airtable.ts | tee "$LOGFILE"

echo "Sync completed at $(date)"
echo "Log has been saved to $LOGFILE"