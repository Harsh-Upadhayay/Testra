#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success messages
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print error messages
log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Initialize git repository
git init
log_success "Initialized git repository"

# Add all files to git
git add .
log_success "Added files to git staging"

# Create initial commit
git commit -m "Initial commit"
log_success "Created initial commit"

# Prompt for GitHub repository URL
echo "https://github.com/Harsh-Upadhayay/Testra.git"
read GITHUB_URL

# Add GitHub remote
git remote add origin $GITHUB_URL
log_success "Added GitHub remote"

# Push to GitHub
git push -u origin master || git push -u origin main
log_success "Pushed code to GitHub"

echo -e "\nRepository has been initialized and code has been pushed to GitHub!"