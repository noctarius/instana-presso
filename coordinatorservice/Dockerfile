#FROM node:10.13-alpine
FROM node:10.6.0

RUN mkdir /root/app
COPY package.json /root/app/package.json

WORKDIR /root/app
#RUN apk add --no-cache --virtual .gyp build-base python && npm install --only=production && apk del .gyp
RUN npm install --only=production

COPY support.js /root/app/support.js
COPY app.js /root/app/app.js

EXPOSE 3000

CMD ["npm", "start"]
