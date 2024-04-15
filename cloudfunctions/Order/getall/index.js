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
      _id: _.neq("数据说明")
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
      avatar_url: $.arrayElemAt(["$user.avatar_url", 0]),
    })
    .sort({
      shipped: 1,
      creat_time: -1,
    })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .end();
};
