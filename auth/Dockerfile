# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# ENV NODE_ENV=production

# EXPOSE 3001

# CMD ["node", "dist/main.js"]

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 🔥 Dev mode
CMD ["npm", "run", "start:dev"]