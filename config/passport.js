const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;









const User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {



        if (err) {
            return done(err);
        }
        if (user) {
            req.flash('signupError','User Already Exist');
            return done(null, false);
        }
        var newUser = new User();
        newUser.fullname = req.body.name;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(function (err) {
            if (err) {


                return done(err);
            }
            return done(null, newUser);
        });
    })
}));








passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {



        if (err) {
            return done(err);
        }
        if (!user) {
            req.flash('loginError','User Data Not Found');
            return done(null, false);
        }

        if (!user.validPassword(req.body.password)) {
            req.flash('passwordError','User Password Is Incorrect');
            return done(null, false);
        }
        return done(null, user);
    })
}));