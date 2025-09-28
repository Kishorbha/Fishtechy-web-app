#!/bin/bash

# Instagram Clone v2 - Development Startup Script

echo "🚀 Starting Instagram Clone v2 Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "   You can install it with: npm install -g pnpm"
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   You can use: brew install postgresql (on macOS)"
    echo "   Or download from: https://www.postgresql.org/download/"
fi

echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
pnpm install

# Install server dependencies
echo "Installing server dependencies..."
cd server && pnpm install && cd ..

echo "🗄️  Setting up database..."

# Check if database exists, create if not
echo "Creating database if it doesn't exist..."
createdb instagram_clone 2>/dev/null || echo "Database already exists or error occurred"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "Pushing database schema..."
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the development servers:"
echo "   Terminal 1: pnpm run api:dev"
echo "   Terminal 2: pnpm run dev"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3001"
echo "   Database Studio: npx prisma studio"
echo ""
echo "🔑 Demo credentials:"
echo "   Email: admin@instagram.com"
echo "   Password: password"
echo ""
echo "Happy coding! 🎉"
