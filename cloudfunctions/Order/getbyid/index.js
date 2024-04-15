const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const $ = db.command.aggregate;
  const _ = db.command;
  return await db
    .collection("Order")
    .aggregate()
    .match({
      _id: event.id,
    })
    .lookup({
      from: "User",
      localField: "_openid",
      foreignField: "_id",
      as: "user"
    })
    .addFields({
      creatTime: $.dateToString({
        date: '$creat_time',
        format: '%Y/%m/%d',
        timezone: 'Asia/Shanghai'
      }),
      creatTimeDetail: $.dateToString({
        date: '$creat_time',
        format: '%Y/%m/%d %H:%M:%S',
        timezone: 'Asia/Shanghai'
      }),
      avatar_url: $.arrayElemAt(["$user.avatar_url", 0]),
    })
    .end();
};
