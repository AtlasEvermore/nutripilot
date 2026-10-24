FROM node:22-alpine

WORKDIR /app

COPY nutripilot-france-hotmart-final-v4/ ./

ARG APP_REVISION=unknown
ENV APP_REVISION=$APP_REVISION
ENV NODE_ENV=production

RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund

EXPOSE 3000

CMD ["node", "server.mjs"]
