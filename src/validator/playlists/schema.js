const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string()
        .pattern(new RegExp('[a-zA-Z]'))
        .required()
});

const PostSongPayloadSchema = Joi.object({
  songId: Joi.string().required()
});

module.exports = {PostPlaylistPayloadSchema, PostSongPayloadSchema};