#!/bin/bash

# Setup Script for Chipkost
echo "🚀 Setting up Chipkost Project..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Drop and recreate database (clean slate)
echo -e "${BLUE}📦 Setting up MySQL database...${NC}"
echo "⚠️  This will drop the existing chipkost_db and recreate it!"
echo "Enter MySQL root password:"

mysql -u root -p <<EOF
DROP DATABASE IF EXISTS chipkost_db;
CREATE DATABASE chipkost_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE 'chipkost_db';
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database recreated successfully${NC}"
else
    echo -e "${RED}✗ Failed to setup database${NC}"
    exit 1
fi

# Backend migrations
echo -e "\n${BLUE}📊 Running Django migrations...${NC}"
cd backend
source venv/bin/activate

# Make migrations
python manage.py makemigrations accounts
python manage.py makemigrations rooms
python manage.py makemigrations billing
python manage.py makemigrations complaints
python manage.py makemigrations rfid
python manage.py makemigrations

# Run migrations
python manage.py migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${RED}✗ Migration failed${NC}"
    exit 1
fi

# Create admin user
echo -e "\n${BLUE}👤 Creating admin user...${NC}"
python manage.py createsuperuser --username admin --email admin@chipkost.com

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}To start the backend:${NC}"
echo "  cd backend && source venv/bin/activate && python manage.py runserver"
echo ""
echo -e "${BLUE}To start the frontend:${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo -e "${BLUE}Access:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000"
echo "  Admin Panel: http://localhost:8000/admin"
