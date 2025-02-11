FROM node:18

RUN apt-get update -y && \
    apt-get install -y libreoffice && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

WORKDIR /app

RUN npm install && \
    npm install libreoffice-convert jwt-decode@3.1.2 && \
    npm install -g nodemon pm2

COPY . .

EXPOSE 5000

CMD ["npm", "start"]