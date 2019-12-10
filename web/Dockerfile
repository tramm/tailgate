FROM mhart/alpine-node:12.4
MAINTAINER tramm

COPY . /var/www/app

# RUN apk del dev-dependencies
RUN npm install 
EXPOSE 8003 
CMD ["npm", "start"]