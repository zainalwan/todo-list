FROM node:16.18.1-slim
WORKDIR /home/zain/todo-list
COPY src/ src/
COPY package*.json tsconfig.json  .
RUN npm ci
RUN npm run build
CMD npm start
