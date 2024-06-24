const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
};

const sanitize = (fields) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = sanitizeHtml(req.body[field]);
      }
    });
    next();
  };
};

module.exports = { validate, sanitize };
