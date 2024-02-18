FROM node:lts-alpine
WORKDIR /findthyface
COPY ./dist/apps/find-thy-face-api .
ENV PORT=8080
EXPOSE ${PORT}
RUN npm install --production
CMD node ./main.js