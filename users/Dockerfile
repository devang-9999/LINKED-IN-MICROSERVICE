# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# ENV NODE_ENV=production

# EXPOSE 3002

# CMD ["node", "dist/main.js"]

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]