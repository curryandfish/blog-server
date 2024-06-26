const db = require("../db/connection");
// 查询用户列表
exports.getUserList = async (req, res) => {
  const { currentPage, pageSize, username } = req.query;
  //   const currentPage = parseInt(req.query.currentPage) || 1;
  //   const pageSize = parseInt(req.query.pageSize) || 10;
  const inquireUserTotal = `select * from users where username like "%${username}%"`;
  let total;
  await db(inquireUserTotal).then((response) => {
    total = response.length;
  });
  const inquireUserListSql = `SELECT * FROM users WHERE username like "%${username}%" ORDER BY create_time ASC LIMIT ${pageSize}  OFFSET ${
    (currentPage - 1) * pageSize
  }`;
  const results = await db(inquireUserListSql);
  const userList = results.map((item) => {
    const { password, ...rest } = item;
    return rest;
  });
  res.send({
    code: 200,
    data: {
      userList: userList,
      total: total,
    },
    message: "success",
  });
};
// 更新用户数据
exports.updateUserInfo = async (req, res) => {
  if (!req.body.id) {
    return res.send({
      code: 400,
      data: null,
      message: "更新失败",
    });
  }
  const userInfo = req.body;
  const { id } = userInfo;
  delete userInfo.id;
  const updateSql = "UPDATE users SET ? WHERE id = ?";
  const result = await db(updateSql, [userInfo, id]);
  if (result.affectedRows == 1) {
    res.send({
      code: 200,
      messgae: "修改成功",
    });
  }
};
// 拉黑用户
exports.dshieldUser = async (req, res) => {
  if (!req.body.id) {
    return res.send({
      code: 400,
      data: null,
      message: "操作失败",
    });
  }
  const { id } = req.body;
  const sql = "select status from users where id = ?";
  db(sql, id).then(async (response) => {
    const status = response[0].status == 1 ? 0 : 1;
    const updateSql = "update users set status = ? where id = ?";
    await db(updateSql, [status, id]).then((result) => {
      if (result.affectedRows == 1) {
        return res.send({
          code: 200,
          message: "success",
        });
      }
    });
  });
};
