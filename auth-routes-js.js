const express = require('express');
const jwt = require('jsonwebtoken');
const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, JWT_SECRET } = require('../config');
const axios = require('axios');

const router = express.Router();

router.post('/token', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: `${req.protocol}://${req.get('host')}/callback`
    });

    const { access_token, id_token, expires_in } = response.data;
    const userInfo = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const token = jwt.sign(
      { 
        sub: userInfo.data.sub,
        email: userInfo.data.email
      },
      JWT_SECRET,
      { expiresIn: expires_in }
    );

    res.json({ token, user: userInfo.data });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
