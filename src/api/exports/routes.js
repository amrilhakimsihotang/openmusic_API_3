const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportMusicHandler,
    options: {
      auth: 'openmusicapp_jwt',
    }
  }
];

module.exports = routes;
