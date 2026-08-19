FROM node:26-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./

COPY src ./src

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]