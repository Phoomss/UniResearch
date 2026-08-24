###############################################################################
# UniResearch Backend – Multi-stage Dockerfile
###############################################################################

# ── Base stage ───────────────────────────────────────────────────────────────

FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies required for asyncpg / psycopg
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# ── Development stage ────────────────────────────────────────────────────────

FROM base AS development

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


# ── Production stage ─────────────────────────────────────────────────────────

FROM base AS production

COPY . .

# Create non-root user
RUN adduser --disabled-password --no-create-home appuser \
    && mkdir -p \
        /app/static/uploads \
        /app/static/uploads/covers \
        /app/static/uploads/documents \
    && chown -R appuser:appuser /app \
    && chmod -R 775 /app/static

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]