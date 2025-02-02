#!/bin/bash

# Exit script if any command fails
set -e

# Define variables
USERNAME="testra"
PASSWORD="shutdoen"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Functions
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create new user
create_user() {
    useradd -m -s /bin/bash "$USERNAME"
    echo "$USERNAME:$PASSWORD" | chpasswd
    log_success "Created user $USERNAME"
}

# Set up sudo access
setup_sudo() {
    usermod -aG sudo "$USERNAME"
    if groups "$USERNAME" | grep -q sudo; then
        log_success "Added $USERNAME to sudo group"
    else
        log_error "Failed to add $USERNAME to sudo group"
        exit 1
    fi
}

# Configure SSH directory
setup_ssh() {
    USER_HOME="/home/$USERNAME"
    mkdir -p "$USER_HOME/.ssh"
    if [ -f "/root/.ssh/authorized_keys" ]; then
        cp /root/.ssh/authorized_keys "$USER_HOME/.ssh/"
    fi
    chmod 700 "$USER_HOME/.ssh"
    chmod 600 "$USER_HOME/.ssh/authorized_keys"
    chown -R "$USERNAME:$USERNAME" "$USER_HOME/.ssh"
    log_success "Configured SSH directory"
}

# Configure firewall
setup_firewall() {
    if ! command -v ufw >/dev/null 2>&1; then
        apt-get update
        apt-get install -y ufw
    fi
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow OpenSSH
    echo "y" | ufw enable
    log_success "Configured firewall"
}

# Main execution
main() {
    if [ "$EUID" -ne 0 ]; then 
        log_error "Please run as root"
        exit 1
    fi
    
    create_user
    setup_sudo
    setup_ssh
    setup_firewall
    log_success "Initial server setup completed successfully"
}

# Run main function
main

# Application-specific setup
su - $USERNAME -c "
    sudo apt update && sudo apt install -y python3 python3-pip python3.12-venv git
    git clone https://github.com/Harsh-Upadhayay/Testra.git
    cd Testra/backend
    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt
    alembic init alembic
    alembic revision --autogenerate -m \"Initial migration\"
    alembic upgrade head
    uvicorn app.main:app --host 0.0.0.0 --port 8000
"
