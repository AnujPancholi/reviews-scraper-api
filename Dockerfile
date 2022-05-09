FROM node:16-alpine

WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser

RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge

COPY package*.json ./

RUN ["npm","install"]

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["npm","start"]