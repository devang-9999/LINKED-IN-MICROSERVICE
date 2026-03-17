# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 4000

# CMD ["node", "dist/main.js"]

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 🔥 Dev mode (hot reload)
CMD ["npm", "run", "start:dev"]