FROM node:22-alpine

WORKDIR /app

COPY nutripilot-france-hotmart-final-v4/ ./

ENV NODE_ENV=production

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "server.mjs"]
