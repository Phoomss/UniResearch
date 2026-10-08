FROM node:22-bookworm-slim AS frontend-deps
WORKDIR /workspace/frontend
RUN npm install --global pnpm@10
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM python:3.11-slim-bookworm
WORKDIR /workspace
RUN apt-get update \
    && apt-get install --yes --no-install-recommends chromium chromium-driver ca-certificates libstdc++6 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=frontend-deps /usr/local/bin/node /usr/local/bin/node
COPY backend/requirements.txt backend/requirements.txt
COPY tests/selenium/requirements.txt tests/selenium/requirements.txt
RUN python -m pip install --no-cache-dir -r tests/selenium/requirements.txt
COPY backend/app backend/app
COPY frontend frontend
COPY --from=frontend-deps /workspace/frontend/node_modules frontend/node_modules
COPY tests tests
RUN useradd --create-home --uid 1000 selenium \
    && mkdir -p /artifacts \
    && chown -R selenium:selenium /workspace /artifacts
USER selenium
ENV SELENIUM_CHROME_BINARY=/usr/bin/chromium \
    SELENIUM_CHROMEDRIVER=/usr/bin/chromedriver \
    SELENIUM_CONTAINER=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "-m", "pytest", "-c", "tests/selenium/pytest.ini", "tests/selenium", "--artifacts", "/artifacts"]
CMD ["-m", "narongsak", "-v"]
