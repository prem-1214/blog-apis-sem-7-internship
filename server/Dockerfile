FROM node:24-alpine 
WORKDIR /app
COPY package*.json .
RUN npm install

# Copy source code
COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000
CMD ["npm", "run", "dev"]
