import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config() // Tải các biến môi trường từ .env

const app = express()

// Route cho trang chủ (homepage)
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the GitHub OAuth App!</h1>')
})

// Sử dụng các giá trị từ tệp .env
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

// Kiểm tra môi trường và sử dụng giá trị `redirect_uri` phù hợp
const redirect_uri =
  process.env.NODE_ENV === 'production'
    ? 'https://manhwa-academy.github.io/bluearchive/login/github/callback'
    : 'http://localhost:3000/login/github/callback'

// Route để bắt đầu quy trình OAuth
app.get('/login/github', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri,
  )}`
  res.redirect(authUrl) // Chuyển người dùng đến GitHub để đăng nhập
})

// Route callback sau khi người dùng cấp quyền
app.get('/login/github/callback', async (req, res) => {
  const { code } = req.query // Lấy mã code từ GitHub (sau khi người dùng cấp quyền)

  if (!code) {
    return res.status(400).send('Code not provided')
  }

  try {
    // Gửi mã code đến GitHub để lấy access token
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id,
        client_secret,
        code,
        redirect_uri,
      },
      headers: {
        Accept: 'application/json', // GitHub yêu cầu trả về kết quả ở định dạng JSON
      },
    })

    const { access_token } = response.data // Lấy access_token từ GitHub

    // Bạn có thể sử dụng access token này để gọi API GitHub (ví dụ lấy thông tin người dùng)
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Hiển thị thông tin người dùng hoặc làm việc với thông tin này
    res.send(`<h1>Welcome, ${userResponse.data.login}!</h1>`) // Ví dụ trả về tên người dùng GitHub
  } catch (error) {
    console.error('Error during OAuth process:', error)
    res.status(500).send('Error during OAuth process')
  }
})

// Khởi chạy server trên cổng 3000
const port = 3000
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
