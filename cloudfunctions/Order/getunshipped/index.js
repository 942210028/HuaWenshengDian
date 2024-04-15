const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const $ = db.command.aggregate;
  const _ = db.command;
  const pageSize = event.pageSize; //每页数量
  const currentPage = event.currentPage; //当前页
  return await db
    .collection("Order")
    .aggregate()
    .match({
      shipped: false,
    })
    .sort({
      creat_time: -1,
    })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .end();
};
