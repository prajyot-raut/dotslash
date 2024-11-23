const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, (req, res) => {
  const { _id, email, name, createdAt } = req.user;
  res.json({
    id: _id,
    email,
    name,
    createdAt
  });
});

module.exports = router;