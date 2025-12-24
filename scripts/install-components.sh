#!/bin/bash

# Horizon Systems Component Library Installation Script
# This script installs all required dependencies for the component library

echo "🚀 Horizon Systems Component Library Installer"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Installing Radix UI primitives...${NC}"
npm install @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-popover @radix-ui/react-dropdown-menu

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Radix UI primitives installed${NC}"
else
    echo -e "${RED}✗ Failed to install Radix UI primitives${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Installing TanStack Table...${NC}"
npm install @tanstack/react-table

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TanStack Table installed${NC}"
else
    echo -e "${RED}✗ Failed to install TanStack Table${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Installing utility libraries...${NC}"
npm install class-variance-authority clsx tailwind-merge

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Utility libraries installed${NC}"
else
    echo -e "${RED}✗ Failed to install utility libraries${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 4: Installing React Hook Form...${NC}"
npm install react-hook-form

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ React Hook Form installed${NC}"
else
    echo -e "${RED}✗ Failed to install React Hook Form${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 5: Installing optional recommended packages...${NC}"
npm install date-fns zod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Optional packages installed${NC}"
else
    echo -e "${YELLOW}⚠ Optional packages failed to install (non-critical)${NC}"
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Installation complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify Tailwind CSS configuration (see COMPONENT_LIBRARY.md)"
echo "2. Add CSS variables to globals.css (see COMPONENT_LIBRARY.md)"
echo "3. Check tsconfig.json path alias configuration"
echo ""
echo -e "${BLUE}For detailed usage instructions, see:${NC}"
echo "  - COMPONENT_LIBRARY.md (comprehensive guide)"
echo "  - Component JSDoc comments (inline documentation)"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
