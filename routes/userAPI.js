var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;

const User = require('../Schema/UserSchema');

// TODO: Login
router.get('/login', function(req, res) {
  res.render('Login/login.html');
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect:  '/',
    failureRedirect:  '/user/login',
    failureFlash:     false
   }
));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/user/login');
});


// PassportJS Login Check
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({username: username}, function(err, user) {

    if (err) {
      return done(null, false, {message: "Error Occured."});
    }
    if (!user) {
      return done(null, false, {message: "Unknown User"});
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {

      if (err) {
        return done(null, false, {message: "Password Error"});
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: "Invalid Password"});
      }
    });
  });
}));

// TODO: Register
router.get('/register', function(req, res) {
  res.render('Login/register.html');
});

router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var phone = req.body.phone;
  var location = req.body.location;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log("Validation Errors.");
    res.json(errors);
  } else {
    var newUser = new User({
      username: username,
      name:     name,
      email:    email,
      password: password,
      phone:    phone,
      location: location
    });

    // Hashing Passwords
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(function(err, userObj) {
              if (err) {
                res.json(err);
              } else {
                console.log("New User Created: " + userObj);
                res.redirect('/user/login');
              }
            });
        });
    });
  }
});

// TODO: User Profile
router.get('/:username', function(req, res) {
  var username = req.params.username;

  User.findOne({username: username}, function(err, userObj) {
    if (err) {
      // Error
      res.json(err);
    } else if (!userObj) {
      // Not query results
      res.send("User not found.");
    } else if (req.user && req.user.username == username) {
      // Is Owner
      res.json(req.user);
    } else {
      // Others
      res.json(userObj);
    }
  });

});

// Passport Setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;
