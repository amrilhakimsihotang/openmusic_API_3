const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string()
     .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
     .required()
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});
 
module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema
};