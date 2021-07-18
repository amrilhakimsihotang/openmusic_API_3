const Joi = require('joi');

const MusicPayloadSchema = Joi.object({
  title: Joi.string()
        .pattern(new RegExp('[a-zA-Z]'))
        .max(50)
        .required(),
  year: Joi.number()
        .min(1900)
        .max(2021)
        .required(),
  performer: Joi.string()
        .pattern(new RegExp('[a-zA-Z]'))
        .required(),
  genre: Joi.string()
        .pattern(new RegExp('[a-zA-Z]'))
        .required(),
  duration: Joi.number().required()
});
 
module.exports = { MusicPayloadSchema };