#!/bin/bash

# Exit on any error
set -e

# Install dependencies
echo "Installing dependencies..."
npm run install:all

# Run tests
echo "Running tests..."
npm test

# Build extension and backend
echo "Building extension and backend..."
npm run build

echo "Build completed successfully!"
