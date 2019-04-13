const User = require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
 
passport.serializeUser((user, next) => {
  next(null, user.id);
})

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then( user => next(null, user) )
    .catch( next )
})

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email })
    .then( user => {
      if (!user) {
        next(null, null,{password:"email y contraseña invalida"})
      } else {
        return user.checkPassword(password)
        .then(match => {
          if(!match){
            next(null, null,{password:"email y contraseña invalida"})
          } else {
            next(null, user)
          }
        })

      }
    })

}));

/*
passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/authenticate/google/cb'
}, (accessToken, refreshToken, profile, next) => {
  // TODO: authenticate user using google
}));
*/
