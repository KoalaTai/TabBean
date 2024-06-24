const mongoose = require('mongoose');
const encryption = require('../utils/encryption');
const config = require('../config');

const knowledgeBaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    set: (value) => encryption.encrypt(value, config.encryptionKey),
    get: (value) => encryption.decrypt(value, config.encryptionKey)
  },
  summary: {
    type: String,
    set: (value) => value ? encryption.encrypt(value, config.encryptionKey) : value,
    get: (value) => value ? encryption.decrypt(value, config.encryptionKey) : value
  },
  url: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { toJSON: { getters: true }, toObject: { getters: true } });

knowledgeBaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

knowledgeBaseSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
