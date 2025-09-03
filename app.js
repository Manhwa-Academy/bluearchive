import express from 'express';
import passport from 'passport';
import session from 'express-session';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config(); // Tải các biến môi trường từ .env

const app = express();

// Cấu hình Passport để sử dụng GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://manhwa-academy.vercel.app/auth/github/callback'
          : 'http://localhost:3000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile); // Lưu thông tin người dùng vào session
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user); // Lưu thông tin người dùng vào session
});

passport.deserializeUser(function (obj, done) {
  done(null, obj); // Phục hồi thông tin người dùng từ session
});

// Middleware để sử dụng session và Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Cung cấp secret từ .env hoặc giá trị mặc định
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Route để redirect người dùng đến GitHub để đăng nhập
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback sau khi người dùng cấp quyền cho ứng dụng
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    console.log('User logged in:', req.user); // Kiểm tra người dùng sau khi đăng nhập thành công
    res.redirect('/'); // Sau khi đăng nhập thành công, chuyển hướng về trang chủ
  },
);

// Trang chính
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { username, displayName, photos } = req.user;
    res.send(`
      <h1>Hi ${displayName || username}, you're logged in!</h1>
      <img src="${photos[0].value}" alt="${username}'s profile picture" />
      <p><a href="/logout">Logout</a></p>
    `);
  } else {
    res.send('<h1>Welcome! Please <a href="/auth/github">login with GitHub</a>.</h1>');
  }
});

// Route để người dùng đăng xuất
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.send('Error while logging out');
    res.redirect('/'); // Sau khi đăng xuất, chuyển về trang chủ
  });
});

const port = process.env.PORT || 3000;

// Khởi chạy server
app.listen(port, () => {
  console.log(
    `App is running on ${
      process.env.NODE_ENV === 'production'
        ? 'https://manhwa-academy.vercel.app'
        : 'http://localhost:3000'
    }`,
  );
});
