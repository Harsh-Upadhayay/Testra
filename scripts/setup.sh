#!/bin/bash

# Create main project directory
mkdir -p backend
cd backend

# Create alembic directory and its subdirectories
mkdir -p alembic/versions

# Create app directory and its subdirectories
mkdir -p app/{models,schemas,crud,api/endpoints,utils}

# Create __init__.py files
touch app/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/crud/__init__.py
touch app/api/__init__.py
touch app/api/endpoints/__init__.py
touch app/utils/__init__.py

# Create main application files
touch app/main.py
touch app/config.py
touch app/dependencies.py

# Create model and schema files
touch app/models/models.py
touch app/schemas/schemas.py

# Create CRUD files
touch app/crud/crud.py

# Create API files
touch app/api/api.py
touch app/api/endpoints/auth.py
touch app/api/endpoints/exams.py
touch app/api/endpoints/sessions.py

# Create utility files
touch app/utils/helpers.py

# Create root level files
touch requirements.txt
touch alembic.ini
touch README.md

# Print success message
echo "Backend directory structure created successfully!"
