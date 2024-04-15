const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const $ = db.command.aggregate;
  const _ = db.command;
  const wxContext = cloud.getWXContext();
  let user_id = event.user_id ? event.user_id : wxContext.OPENID;
  return await db
    .collection("Order")
    .aggregate()
    .match({
      _openid: user_id,
    })
    .limit(1000)
    .end();
};
