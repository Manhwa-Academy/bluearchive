const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

const app = express();

// Cấu hình Passport
passport.use(new GitHubStrategy({
  clientID: 'Ov23li32jDZXTfUVDXQM',
  clientSecret: 'e30ce588bb78d96fc8bf9dc861618d11168b3e01',
  callbackURL: 'http://localhost:3000/auth/github/callback'
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Middleware
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Route để redirect người dùng đến GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback sau khi đăng nhập thành công
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

// Trang chính
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hi ${req.user.username}, you're logged in!</h1>`);
  } else {
    res.send('<h1>Welcome! Please <a href="/auth/github">login with GitHub</a>.</h1>');
  }
});

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
