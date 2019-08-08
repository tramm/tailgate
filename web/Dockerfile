FROM tramm/node_react_master:latest
MAINTAINER tramm

COPY . /var/www/app
RUN npm run build

# RUN apk del dev-dependencies
 
EXPOSE 8000
CMD ["npm", "start"]