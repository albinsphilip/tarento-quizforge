#!/bin/bash

# QuizForge Database Setup Script

echo "================================"
echo "QuizForge Database Setup"
echo "================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Check if PostgreSQL service is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL service is not running. Starting it..."
    sudo systemctl start postgresql
    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL service started"
    else
        echo "❌ Failed to start PostgreSQL service"
        exit 1
    fi
else
    echo "✅ PostgreSQL service is running"
fi

# Create database
echo ""
echo "Creating database 'quizforge'..."
sudo -u postgres psql -c "CREATE DATABASE quizforge;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'quizforge' created successfully"
else
    echo "⚠️  Database 'quizforge' might already exist"
    sudo -u postgres psql -c "\l" | grep quizforge
fi

# Ensure postgres user can connect (for development)
echo ""
echo "Setting up database user..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null

echo ""
echo "================================"
echo "✅ Database setup complete!"
echo "================================"
echo ""
echo "Database Details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: quizforge"
echo "  Username: postgres"
echo "  Password: postgres"
echo ""
echo "You can now start the backend with:"
echo "  cd backend && mvn spring-boot:run"
