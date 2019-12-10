FROM tramm/node_react_master:latest
MAINTAINER tramm

COPY . /var/www/app
RUN npm run build

# RUN apk del dev-dependencies
 
EXPOSE 8003
CMD ["npm", "start"]