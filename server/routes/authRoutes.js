var app = require('../server');
var express = require('express');
var CongressPerson = require('../models/congressPersonModel');
var scraperjs = require('scraperjs');

var router = express.Router();
var passport = require('passport');
var User = require('../models/userModel');


router.get('/', function(req, res){
  res.send('You reached the AUTH route!');
});

router.post('/login',
  passport.authenticate('local'),
  function(req,res) {
    // searchCache holds the user's previous searches.
    res.send({_id: req.user._id, searchCache: req.user.searchCache});
  }
);

router.get('/logout', function(req,res) {
    req.logout();
    res.end();
  }
);

router.post('/register',
  function(req,res) {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) console.log(err);

      // If user does not already exist.
      if (!user) {
        User.create({password: req.body.password, email: req.body.email, searchCache: []}, function(err, user){
          if (err) console.log(err);
          // Redirect to loggedin version of search page.
          res.send({_id: user._id, searchCache: user.searchCache});
        });

      // If user does exist.
      } else {
        res.send('This account already exists');
      }
    });
  }
);

module.exports = router;