const passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({secret: 'girl cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.use(new GithubStrategy({
    clientID: '85b65227d60665f614a1', //process.env.CLIENT_ID,
    clientSecret: '5c7bebf4c366d76ddf14297440d2b7f0b2f4fc9c',//process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3002/auth/github/callback'
},

function(accessToken, refreshToken, profile, done) {

    return done(null, profile);
}

));

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user,done) {
    done(null,user);
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/home', (req,res) => {
    res.render('landingPage');
})

app.get('/ping', (req,res,next) => {
    res.send('pong!');
})

app.listen(3002, () => {
    console.log('Server up and running on 3002');

})

// Login
app.get('/auth/github', passport.authenticate('github'));

//Callback after successfull auth
app.get('/auth/github/callback', passport.authenticate('github', {failedRedirect: '/fail'}),
function(req,res) {
    res.redirect('/dashboard')
})


//logout callback
app.get('/logout', (req,res) => {
    console.log('logging out');
    req.logout();
    res.redirect('/home');
})

app.get('/dashboard', (req,res) => {
    res.render('dashboard');
})

app.get('/accounts', ensureAuthenticated, (req,res) => {
    res.send('Access was granted.. ACCOUNTS:');
})

app.get('/logout', (req,res) => {
    res.send('sucessfully logged out');
})

// FUNCTIONS


// Create authentication/redirect function

function ensureAuthenticated(req,res,next) {
    // if req.user is available and true.. send them out with next
    if (req.isAuthenticated()) {
        return next();
    }
    // if fails check, redirect out/deny
    res.redirect('/home');
}