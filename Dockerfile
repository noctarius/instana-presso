FROM node:alpine

RUN mkdir /root/app
COPY package.json /root/app/package.json
COPY app.js /root/app/app.js
ADD bin /root/app/bin
ADD public /root/app/public
ADD routes /root/app/routes

WORKDIR /root/app
RUN npm cache clean && npm install --silent --progress=false --production

EXPOSE 3000

CMD ["npm", "start"]