FROM node:22-bookworm-slim AS frontend-deps
WORKDIR /workspace/frontend
RUN npm install --global pnpm@10
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM python:3.11-slim-bookworm
WORKDIR /workspace
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl ca-certificates libstdc++6 \
    && curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg \
    && curl -fsSLo /etc/apt/sources.list.d/brave-browser-release.sources https://brave-browser-apt-release.s3.brave.com/brave-browser.sources \
    && apt-get update \
    && apt-get install --yes --no-install-recommends brave-browser \
    && rm -rf /var/lib/apt/lists/*
COPY tests/selenium/install_chromedriver.py /tmp/install_chromedriver.py
RUN python /tmp/install_chromedriver.py
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
ENV SELENIUM_CHROME_BINARY=/usr/bin/brave-browser \
    SELENIUM_CHROMEDRIVER=/usr/local/bin/chromedriver \
    SELENIUM_BROWSER_NAME=Brave \
    SELENIUM_STARTUP_TIMEOUT=300 \
    SELENIUM_CONTAINER=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "-m", "pytest", "-c", "tests/selenium/pytest.ini", "tests/selenium", "--artifacts", "/artifacts"]
CMD ["-m", "narongsak", "-v"]
