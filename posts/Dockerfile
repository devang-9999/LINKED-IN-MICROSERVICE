# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN mkdir -p uploads

# RUN npm run build

# EXPOSE 3003

# CMD ["node", "dist/main.js"]

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]