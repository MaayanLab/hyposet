# --- build the frontend ---
FROM node:24-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY webpack.config.js ./
COPY src ./src
RUN npm run build

# --- build the python environment ---
FROM python:3.14-alpine AS backend
RUN apk add --no-cache git
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r /requirements.txt \
  && pip uninstall -y pip

# --- runtime ---
FROM python:3.14-alpine
COPY deps.txt /deps.txt
# musl & sqlite-libs are pulled from edge for CVE fixes not yet backported to the
#  stable alpine branch (CVE-2026-107891, CVE-2026-119586); drop once they are.
RUN apk upgrade --no-cache \
  && apk upgrade --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main musl musl-utils sqlite-libs \
  && apk add --no-cache $(grep -v '^#' /deps.txt) \
  && rm /deps.txt \
  && python3 -m pip uninstall -y pip
COPY --from=backend /venv /venv
ENV PATH="/venv/bin:$PATH"
WORKDIR /app
COPY app.py ./
COPY production ./production
COPY --from=frontend /app/dist ./dist
RUN chmod +x /app/production/entrypoint.sh
CMD ["/app/production/entrypoint.sh", "supervisord", "-n", "-c", "/app/production/supervisor.conf"]
