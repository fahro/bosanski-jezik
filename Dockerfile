# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Python backend with static files
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app ./app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Copy audio files (generated with Azure TTS)
COPY backend/static/audio ./static/audio

# Expose port (Railway uses dynamic PORT)
EXPOSE ${PORT:-8000}

# Start server with Railway's PORT environment variable
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
