FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production \
    PORT=5000

EXPOSE 5000

CMD ["node", "src/server.js"]