FROM docker.io/node:lts-alpine
USER node
ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node ./dist/apps/find-thy-face-api ./
RUN npm ci
RUN npm install tslib pg

EXPOSE 3000
CMD ["node", "main.js"]