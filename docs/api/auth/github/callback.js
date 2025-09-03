const axios = require('axios')

module.exports = async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.status(400).send('Code not provided')
  }

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        Accept: 'application/json',
      },
    })

    const { access_token } = response.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    res.send(`Hello, ${userResponse.data.login}! You're logged in.`)
  } catch (error) {
    console.error('Error during OAuth callback:', error)
    res.status(500).send('OAuth callback error')
  }
}
