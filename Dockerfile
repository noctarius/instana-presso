FROM node:10.13-alpine

RUN mkdir /root/app
COPY package.json /root/app/package.json
COPY app.js /root/app/app.js
ADD bin /root/app/bin

WORKDIR /root/app
RUN apk add --no-cache --virtual .gyp build-base python && npm install --only=production && apk del .gyp

EXPOSE 3000

CMD ["npm", "start"]
