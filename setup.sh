#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null
then
  echo -e "${RED}Node.js not installed${NC}"
  exit 1
fi

echo -e "${GREEN}Node found: $(node -v)${NC}"

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

echo -e "${YELLOW}Creating database...${NC}"
npx prisma db push

echo -e "${GREEN}Setup complete!${NC}"