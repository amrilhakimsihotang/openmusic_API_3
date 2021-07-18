require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

//OpenMusicService
const songs = require('./api/songs');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicValidator = require('./validator/openmusic');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const OpenPlaylistService = require('./services/postgres/OpenPlaylistService');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const OpenCollaborationService = require('./services/postgres/OpenCollaborationService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/redis/CacheService');


const init = async () => {
  const cacheService = new CacheService();
  const openMusicService = new OpenMusicService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const openCollaborationService = new OpenCollaborationService(cacheService);
  const openPlaylistService = new OpenPlaylistService(openCollaborationService,cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'));


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert
    }
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    })
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: openMusicService,
        validator: OpenMusicValidator,
      }
    },
    {
      plugin: playlists,
      options: {
        service: openPlaylistService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        openCollaborationService,
        openPlaylistService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: _exports,
      options:{
        service: ProducerService,
        validator: ExportsValidator,
        openPlaylistService
      }
    },
    { plugin: uploads,
      options:{
        service: storageService,
        validator: UploadsValidator
      }
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};


init();