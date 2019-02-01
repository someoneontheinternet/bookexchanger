var express = require('express');
var router = express.Router();

// Book Book Schema
const Book = require('../Schema/BookSchema');

router.get('/', function(req, res) {
  Book.find({}).exec(function(err, books) {
    if (err) {
      res.send(err);
    } else {
      res.send(books);
    }
  });
})

router.post('/', function(req, res) {
  var book = new Book({
    title   : req.body.title,
    author  : req.body.author,
    field   : req.body.field,
    price   : req.body.price
  });

  book.save(function(err, post) {
    res.json(post);
  });
});

module.exports = router;
