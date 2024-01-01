FROM node:18
WORKDIR /app
RUN npm install -g @angular/cli@13
COPY . .
CMD ["npm", "run", "docker"]