FROM docker.io/node:lts-alpine
USER node
WORKDIR /app

RUN npm install tslib express dotenv body-parser cors knex bcrypt

COPY --chown=node ./dist/apps/find-thy-face-api ./dist/apps/find-thy-face-api
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "./dist/apps/find-thy-face-api/main.js"]