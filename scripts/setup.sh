#!/bin/bash

# Horizon Systems - Project Setup Script
# Automated setup for development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "Horizon Systems - Setup Script"

    # Step 1: Check prerequisites
    print_info "Checking prerequisites..."

    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher. Current version: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) installed"

    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm $(npm -v) installed"

    if ! command_exists git; then
        print_warning "Git is not installed. Version control features will be limited."
    else
        print_success "Git $(git --version | cut -d' ' -f3) installed"
    fi

    # Step 2: Install dependencies
    print_header "Installing Dependencies"
    print_info "This may take a few minutes..."

    if npm ci --legacy-peer-deps 2>/dev/null; then
        print_success "Dependencies installed with npm ci"
    else
        print_warning "npm ci failed, trying npm install..."
        npm install --legacy-peer-deps
        print_success "Dependencies installed with npm install"
    fi

    # Step 3: Environment setup
    print_header "Environment Configuration"

    if [ ! -f .env.local ]; then
        print_info "Creating .env.local from template..."
        cp .env.local.example .env.local
        print_warning "Please edit .env.local with your actual credentials"
        print_info "You need to add:"
        print_info "  - Supabase credentials (https://supabase.com)"
        print_info "  - Mapbox token (https://mapbox.com)"
        print_info "  - OpenAI API key (optional)"
    else
        print_success ".env.local already exists"
    fi

    # Step 4: Validate environment
    print_header "Validating Configuration"

    if grep -q "your_.*_here" .env.local; then
        print_warning "Some environment variables still have placeholder values"
        print_info "Please update .env.local with actual credentials"
    else
        print_success "Environment variables configured"
    fi

    # Step 5: Git setup (if in git repo)
    if [ -d .git ]; then
        print_header "Git Configuration"

        # Set up git hooks
        if [ -d .git/hooks ]; then
            print_info "Setting up git hooks..."
            # Add pre-commit hook
            cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for Horizon Systems

echo "Running pre-commit checks..."

# Run linter
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix errors before committing."
    exit 1
fi

echo "✓ Pre-commit checks passed"
exit 0
EOF
            chmod +x .git/hooks/pre-commit
            print_success "Git hooks configured"
        fi
    fi

    # Step 6: Check optional tools
    print_header "Optional Tools"

    if command_exists docker; then
        print_success "Docker installed - containerization available"
    else
        print_info "Docker not installed (optional for deployment)"
    fi

    if command_exists kubectl; then
        print_success "kubectl installed - Kubernetes deployment available"
    else
        print_info "kubectl not installed (optional for Kubernetes deployment)"
    fi

    if command_exists vercel; then
        print_success "Vercel CLI installed - easy deployments available"
    else
        print_info "Vercel CLI not installed (optional, install with: npm i -g vercel)"
    fi

    # Step 7: Final checks
    print_header "Running Final Checks"

    print_info "Testing build process..."
    if npm run build > /dev/null 2>&1; then
        print_success "Build successful"
    else
        print_warning "Build failed - please check your configuration"
        print_info "Try running: npm run build"
    fi

    # Step 8: Summary
    print_header "Setup Complete!"

    echo -e "${GREEN}🚀 Your development environment is ready!${NC}\n"
    echo -e "Next steps:"
    echo -e "  1. Edit ${YELLOW}.env.local${NC} with your credentials"
    echo -e "  2. Run ${YELLOW}npm run dev${NC} to start the development server"
    echo -e "  3. Open ${YELLOW}http://localhost:3000${NC} in your browser"
    echo -e "\nUseful commands:"
    echo -e "  ${YELLOW}npm run dev${NC}              - Start development server"
    echo -e "  ${YELLOW}npm run build${NC}            - Build for production"
    echo -e "  ${YELLOW}npm run lint${NC}             - Run linter"
    echo -e "  ${YELLOW}npm run upload-models${NC}    - Upload 3D models to Supabase"
    echo -e "\nDocumentation:"
    echo -e "  ${YELLOW}README.md${NC}                - Getting started guide"
    echo -e "  ${YELLOW}CLAUDE.md${NC}                - Development guidelines"
    echo -e "  ${YELLOW}CONTRIBUTING.md${NC}          - Contribution guide"
    echo -e "  ${YELLOW}DEPLOYMENT.md${NC}            - Deployment instructions"
    echo -e "\n${BLUE}Happy coding! 🎉${NC}\n"
}

# Run main function
main "$@"
