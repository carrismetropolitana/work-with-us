FROM node:18-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

COPY apps/api/package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY apps/api/dist ./dist

USER fastify

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

CMD ["node", "dist/index.js"]
