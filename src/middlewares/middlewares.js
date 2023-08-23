const parser = require("ua-parser-js");

const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password, birthday, gender } = req.body;

  // Kiểm tra xem tất cả các trường có giá trị không trống
  if (!firstName || !lastName || !email || !password || !birthday || !gender) {
    return res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password phải nhiều hơn 8 kí tự",
    });
  }
  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }

  next();
};
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đủ email và mật khẩu" });
  }
  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }
  next();
};
const logUserAgent = (req, res, next) => {
  const ua = parser(req.headers["user-agent"]);
  req.ua = ua;
  next();
};
module.exports = { validateRegister, validateLogin, logUserAgent };
