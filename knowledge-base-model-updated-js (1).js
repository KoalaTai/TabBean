const mongoose = require('mongoose');

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
    required: true
  },
  summary: String,
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
});

knowledgeBaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

knowledgeBaseSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
