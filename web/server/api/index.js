const publicApi = require('./public');
const userApi = require('./user');
const eventApi = require('./event');
const adminApi = require('./admin');
const locationRegistrationApi = require('./locationRegistration');

function api(server) {
  server.use('/api/v1/public', publicApi);
  server.use('/api/v1/user', userApi);
  server.use('/api/v1/event', eventApi);
  server.use('/api/v1/admin', adminApi);
  server.use('/api/v1/locationRegistration', locationRegistrationApi);
}

module.exports = api;
