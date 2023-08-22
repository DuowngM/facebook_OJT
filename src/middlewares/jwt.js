const jwt = require("jsonwebtoken");

const middleWareJwtController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Token" });
        }
        req.user = user;
        return next();
      });
    } else {
      return res.status(401).json({ message: "Invalid Tokennn" });
    }
  },
};

module.exports = middleWareJwtController;
