var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: String,
  author: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  field: String,
  date: {
    type: Date,
    default: Date.now
  },
  comment: String,
  tags: [{
    type: String
  }],
  price: Number
});

module.exports = mongoose.model('Book', bookSchema);
