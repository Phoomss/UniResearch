###############################################################################
# UniResearch Backend – Multi-stage Dockerfile
###############################################################################

# ── Base stage ───────────────────────────────────────────────────────────────
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies required for asyncpg / psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Development stage ────────────────────────────────────────────────────────
FROM base AS development

# Source is bind-mounted via docker-compose volumes, but copy as fallback
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ── Production stage ─────────────────────────────────────────────────────────
FROM base AS production

COPY . .

# Create a non-root user for security
RUN adduser --disabled-password --no-create-home appuser \
    && mkdir -p /app/static \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
