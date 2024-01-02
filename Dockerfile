FROM node:18
ENV NG_APP_SERVER https://nestjs-api-production-1dd1.up.railway.app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "docker"]