const jwt = require('jsonwebtoken');

const EXPIRATION = '2h';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = {
  signToken({email, _id, profile}) {
    const data = {email, _id, profile};
    return jwt.sign({data}, JWT_SECRET, {
      expiresIn: EXPIRATION,
    });
  },

  jwtAuth({req}) {
    if (!req.headers.authorization) return req;
    const token = req.headers.authorization.split(' ').pop().trim();
    try {
      const {data} = jwt.verify(token, JWT_SECRET, {maxAge: EXPIRATION});
      req.user = data;
    } catch (err) {
      console.warn(`Invalid token: ${err.message}`);
    }
    return req;
  },
};
