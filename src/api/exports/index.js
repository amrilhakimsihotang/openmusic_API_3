const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '3.0.0',
  register: async (server, { service, validator, openPlaylistService }) => {
    const exportsHandler = new ExportsHandler(service, validator, openPlaylistService);
    server.route(routes(exportsHandler));
  }
};
