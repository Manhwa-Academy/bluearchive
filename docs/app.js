// Import các thư viện
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy
require('dotenv').config() // Tải các biến môi trường từ tệp .env

const app = express()

// Cấu hình Passport để sử dụng GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID, // Lấy clientID từ .env
      clientSecret: process.env.CLIENT_SECRET, // Lấy clientSecret từ .env
      callbackURL: process.env.CALLBACK_URL, // Lấy callbackURL từ .env
    },
    function (accessToken, refreshToken, profile, done) {
      // Lưu thông tin người dùng vào session
      return done(null, profile)
    },
  ),
)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// Middleware để sử dụng session và Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Lấy session secret từ .env
    resave: false,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

// Route để redirect người dùng đến GitHub để đăng nhập
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))

// Callback sau khi người dùng cấp quyền cho ứng dụng
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/')
  },
)

// Trang chính
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // Nếu người dùng đã đăng nhập, hiển thị thông tin người dùng
    const { username, displayName, photos } = req.user
    res.send(`
      <h1>Hi ${displayName || username}, you're logged in!</h1>
      <img src="${photos[0].value}" alt="${username}'s profile picture" />
      <p><a href="/logout">Logout</a></p>
    `)
  } else {
    // Nếu chưa đăng nhập, hiển thị liên kết đăng nhập
    res.send('<h1>Welcome! Please <a href="/auth/github">login with GitHub</a>.</h1>')
  }
})

// Route để người dùng đăng xuất
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.send('Error while logging out')
    res.redirect('/')
  })
})

// Khởi chạy server
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
