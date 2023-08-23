const database = require("../utils/database");
const argon = require("argon2");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthday, gender } = req.body;
    // Validate
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    }
    // Check user đã tồn tại trong db chưa
    const [checkUser] = await database.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (checkUser.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await argon.hash(password);

    const fullName = `${firstName} ${lastName}`;

    const avatar =
      "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg";
    //Lấy thời gian hiện tại
    const createdAt = moment()
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss");
    // Tạo câu query
    const query = `
            INSERT INTO users (firstName, lastName, email, password, fullName, birthday, gender, avatar, createdAt, checkLogin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `;
    // Thêm vào database
    await database.execute(query, [
      firstName,
      lastName,
      email,
      hashedPassword,
      fullName,
      birthday,
      gender,
      avatar,
      createdAt,
    ]);
    // Lấy dữ liệu user vừa được tạo ra
    const [newUser] = await database.execute(
      "SELECT * FROM users ORDER BY user_id DESC LIMIT 1"
    );
    // Tạo mã thông báo JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    // Tạo accessToken
    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    // Đặt token vào cookie
    res.cookie("token", token, { httpOnly: true });
    // Loại bỏ trường khi gửi lên client
    const {
      password: _,
      firstName: __,
      lastName: ___,
      ...userData
    } = newUser[0];
    // Trả về client
    return res.status(201).json({
      message: "Người dùng đã được tạo",
      userData,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình tạo người dùng" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem người dùng tồn tại
    const [user] = await database.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // So sánh mật khẩu
    const passwordMatch = await argon.verify(user[0].password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Loại bỏ các trường khỏi thông tin người dùng
    const { password: _, firstName: __, lastName: ___, ...userData } = user[0];

    // Tạo mã thông báo JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    // Tạo accessToken
    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    // Đặt token vào cookie
    res.cookie("token", token, { httpOnly: true });

    // Trả về thông tin người dùng (không bao gồm mật khẩu) và mã thông báo
    return res
      .status(200)
      .json({ message: "Đăng nhập thành công", accessToken, user: userData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập" });
  }
};

module.exports = { register, login };
