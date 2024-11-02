FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
