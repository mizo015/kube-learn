FROM node:20 AS build

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

FROM node:20

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 3000

USER node


CMD ["node", "src/index.js"]
