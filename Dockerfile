FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /src/routes/.next ./.next
COPY --from=base /src/routes/node_modules ./node_modules
COPY --from=base /src/routes/package.json ./package.json
COPY --from=base /src/routes/public ./public

EXPOSE 3000

CMD ["npm", "start"]
