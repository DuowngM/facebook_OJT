const database = require("../utils/database");
const moment = require("moment-timezone");
const createPost = async (req, res) => {
  try {
    const { content, user_id, typePost, checkIn, background, view } = req.body;
    //Lấy thời gian hiện tại
    const createdAt = moment()
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss");
    // Câu lệnh query
    const query =
      "INSERT INTO posts (content, user_id, typePost, checkIn, background, view, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await database.execute(query, [
      content,
      user_id,
      typePost,
      checkIn,
      background,
      view,
      createdAt,
    ]);
    res.status(201).json({
      message: "Tạo post thành công",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost };
