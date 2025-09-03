const axios = require('axios') // Hoặc bạn có thể dùng node-fetch

module.exports = async (req, res) => {
  const { code } = req.query // GitHub sẽ trả về `code` trong query string

  if (!code) {
    return res.status(400).send('Code not provided')
  }

  try {
    // Gửi yêu cầu tới GitHub để lấy access token
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        Accept: 'application/json', // Đảm bảo GitHub trả kết quả dưới dạng JSON
      },
    })

    const { access_token } = response.data

    // Dùng access_token để gọi GitHub API và lấy thông tin người dùng
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Trả về thông tin người dùng hoặc chuyển hướng về một trang khác
    res.send(`Hello, ${userResponse.data.login}! You're logged in.`)
  } catch (error) {
    console.error('Error during OAuth callback:', error)
    res.status(500).send('OAuth callback error')
  }
}
