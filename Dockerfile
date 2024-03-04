FROM node:alpine

WORKDIR /app
COPY . .
COPY model ./client/

RUN npm install

CMD ["npm", "run", "start"]
EXPOSE 3001
