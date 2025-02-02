FROM node:18

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y libreoffice && \
    rm -rf /var/lib/apt/lists/*

RUN npm install
RUN npm install -g nodemon pm2
RUN npm install libreoffice-convert
RUN npm install jwt-decode@3.1.2

COPY . .

EXPOSE 5000

CMD ["npm", "start"]