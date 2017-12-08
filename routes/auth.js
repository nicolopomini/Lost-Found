//strict mode
'use strict';

//initializing router
const express = require('express');
const router = express.Router();

//loading config file
const config = require('../config/config.js');

//loading User Schema
const User = require('../models/user.js');

//passport + strategy setup
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function extractProfile (profile) {
  /*
  //debug
  console.log('Extracted profile');
  console.log(profile);
  */

  //returns new User based on the extracted profile
  return {
    //id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value
  }
}

// Configure the Google strategy for use by Passport.js.
// Passport's strategies are supplied via use() function.
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
  clientID: config.get('OAUTH2_CLIENT_ID'),
  clientSecret: config.get('OAUTH2_CLIENT_SECRET'),
  callbackURL: config.get('OAUTH2_CALLBACK'),
  accessType: 'offline'
}, (accessToken, refreshToken, profile, done) => {
  if(profile._json.domain === 'studenti.unitn.it' || profile._json.domain === 'unitn.it'){
    //checks if user exixst, otherwise it will be created
    var extracted = extractProfile(profile);
    User.findOne({email: extracted.email}, (err, found) => {
      //handling db error
      if (err) {
        done(err, false, {message: 'DB error while checking users!'});
      }
      //profile already registered
      else if (found) {
        done(null, found);
      }
      //no profile found: the user must be registered into the DB
      else {
        //creating new User based on the extracted params
        var user = new User({
          name: extracted.name,
          email: extracted.email
        });

        //checking if user params are validate
        if(!(user.validateSync() == undefined)) {
          done(new Error('Parametri utente non validi!'), false);
        }
        else {
          //debug
          console.log('Insert new user:');
          console.log(user);

          //saving new user
          user.save((err) => {
            if (err) done(err, false); //throws error
            else done(null, user); //loads new user into session
          });
        }
      }
    });

    //done function
    //  err = null
    //  user = extractProfile
    //done(null, extractProfile(profile));
  }
  else {
    //done function
    //  err = null
    //  user = false (not auth)
    //  message
    done(null, false);
    //done(new Error('Facebook account already registered/linked.'), false);
  }
}));

//saving to session
passport.serializeUser((user, done) => {
  done(null, user.toObject());
});

//retrieving from session
passport.deserializeUser((obj, done) => {
  done(null, new User(obj));
});
// [END setup]

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired (req, res, next) {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables (req, res, next) {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
  next();
}
// [END middleware]

// Begins the authorization flow. The user will be redirected to Google where
// they can authorize the application to have access to their basic profile
// information. Upon approval the user is redirected to `/auth/google/callback`.
// If the `return` query parameter is specified when sending a user to this URL
// then they will be redirected to that URL when the flow is finished.
// [START authorize]
router.get(
  // Login url
  '/auth/login',

  // Save the url of the user's current page so the app can redirect back to
  // it after authorization
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  },

  // Start OAuth 2 flow using Passport.js
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
    //hd: ['unitn.it', 'studenti.unitn.it']
  })
);
// [END authorize]

// [START callback]
router.get(
  // OAuth 2 callback url. Use this url to configure your OAuth client in the
  // Google Developers console
  '/auth/google/callback',

  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('google', {
    failureRedirect: '/auth/logout'
  }),

  // Redirect back to the original page, if any
  (req, res) => {
    //redirects to original url if any
    const redirect = req.session.oauth2return || '/';
    //deletes the riginal url from session
    delete req.session.oauth2return;
    res.redirect(redirect);
  }
);
// [END callback]

// Deletes the user's credentials and profile from the session.
// This does not revoke any active tokens.
router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = {
  router: router,
  required: authRequired
}
