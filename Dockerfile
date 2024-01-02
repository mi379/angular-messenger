FROM node:18

ENV NG_APP_SERVER https://nestjs-api-production-1dd1.up.railway.app
ENV NG_APP_APP_ID 1:848611587001:web:a686a8d95763342e0d7c68
ENV NG_APP_API_KEY AIzaSyB1KmabzVdlP3Ggqhf9i6QAm6Z3W09ihUc
ENV NG_APP_AUTH_DOMAIN angular-messenger-88222.firebaseapp.com
ENV NG_APP_PROJECT_ID angular-messenger-88222
ENV NG_APP_STORAGE_BUCKET angular-messenger-88222.appspot.com
ENV NG_APP_MESSAGING_SENDER_ID 848611587001


WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "docker"]