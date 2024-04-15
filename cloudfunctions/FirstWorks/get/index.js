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
    .collection("FirstWorks")
    .aggregate()
    .match({
      _openid: wxContext.OPENID
    })
    .lookup({
      from: "User",
      localField: "_openid",
      foreignField: "_id",
      as: "user"
    })
    .addFields({
      avatar_url: $.arrayElemAt(["$user.avatar_url", 0]),
    })
    .limit(1000)
    .end();
};
