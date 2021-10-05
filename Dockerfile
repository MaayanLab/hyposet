FROM node

ARG DEBIAN_FRONTEND="noninteractive"

ADD deps.txt /deps.txt
RUN set -x \
  && echo "Installing system dependencies from deps.txt..." \
  && apt-get -y update \
  && apt-get -y install $(grep -v '^#' /deps.txt) \
  && rm -rf /var/lib/apt/lists/* \
  && rm /deps.txt

ADD requirements.txt /requirements.txt
RUN set -x \
  && echo "Installing python dependencies from requirements.txt..." \
  && pip3 install --no-cache-dir -r requirements.txt \
  && rm /requirements.txt

ADD . /app
WORKDIR /app
RUN npm i && npm run build && rm -r node_modules

RUN chmod +x /app/production/entrypoint.sh
CMD ["/app/production/entrypoint.sh", "supervisord", "-n", "-c", "/app/production/supervisor.conf"]
