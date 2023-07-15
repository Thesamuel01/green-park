import Joi from 'joi';

const fileNameRegex = /^[^!#$/%&*]+$/;
const MAX_SIZE = 10 * 1024 * 1024;

export const ProcessCsvValidation = {
  file: Joi.object()
    .keys({
      buffer: Joi.binary().max(MAX_SIZE).required(),
      mimetype: Joi.string().valid('text/csv').required(),
      fileName: Joi.string().pattern(fileNameRegex).optional(),
      size: Joi.number()
        .messages({
          'number.max': 'Size exceeds the maximum allowed value of 10MB'
        })
        .required()
    })
    .unknown(true)
    .required()
};

export const ProcessPdfValidation = {
  file: Joi.object()
    .keys({
      buffer: Joi.binary().max(MAX_SIZE).required(),
      mimetype: Joi.string().valid('application/pdf').required(),
      fileName: Joi.string().pattern(fileNameRegex).optional(),
      size: Joi.number()
        .messages({
          'number.max': 'Size exceeds the maximum allowed value of 10MB'
        })
        .required()
    })
    .unknown(true)
    .required()
};
