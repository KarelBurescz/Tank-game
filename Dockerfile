FROM node:alpine

WORKDIR /app
COPY . .
COPY model ./client/

RUN npm install
#RUN npm run build

CMD ["npm", "run", "start"]
EXPOSE 3001
