#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client
echo "Building client..."
cd client
npm run build

# Copy client build to dist folder
echo "Copying client build..."
mkdir -p ../dist
cp -r dist/* ../dist/

# Build the server
echo "Building server..."
cd ..
npm run build

echo "Build completed successfully!"