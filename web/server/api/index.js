const publicApi = require('./public');
const userApi = require('./user');


function api(server) {
  server.use('/api/v1/public', publicApi);
  server.use('/api/v1/user', userApi);
  //server.use('/api/v1/admin', adminApi);
}

module.exports = api;
