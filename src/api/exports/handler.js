const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator, openPlaylistService) {
    this._service = service;
    this._validator = validator;
    this._openPlaylistService = openPlaylistService;
    
    this.postExportMusicHandler = this.postExportMusicHandler.bind(this);
  }

  async postExportMusicHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);
      const { playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._openPlaylistService.verifyPlaylistAccess(playlistId, userId);

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage('export:songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrian',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
