// middleware/auth.js
const auth = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (apiKey !== '12345') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }

  next();
};

module.exports = auth;
