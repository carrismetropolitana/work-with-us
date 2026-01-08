FROM node:18-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY apps/frontend/public ./public
COPY --chown=nextjs:nodejs apps/frontend/.next/standalone ./
COPY --chown=nextjs:nodejs apps/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

CMD ["node", "apps/frontend/server.js"]
