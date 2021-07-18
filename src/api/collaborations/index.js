const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'openCollaborations',
  version: '2.0.0',
  register: async ( server, { openCollaborationService, openPlaylistService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      openCollaborationService, openPlaylistService, validator
      );
    server.route(routes(collaborationsHandler));}
  };