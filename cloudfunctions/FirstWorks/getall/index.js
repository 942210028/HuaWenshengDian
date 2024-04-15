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
    .collection("FirstWorks")
    .aggregate()
    .match({
      _id: _.neq("数据说明"),
      group: event.group,
      judges_id: event.judge,
      video_url: _.and([_.neq(""), _.exists(true)])
    })
    .lookup({
      from: "User",
      localField: "_openid",
      foreignField: "_id",
      as: "user"
    })
    .addFields({
      avatar_url: $.arrayElemAt(["$user.avatar_url", 0]),
      groupSort: $.switch({
        branches: [{
            case: $.eq(['$group', '小低']),
            then: 1
          },
          {
            case: $.eq(['$group', '小高']),
            then: 2
          },
          {
            case: $.eq(['$group', '初中']),
            then: 3
          },
        ],
        default: 4
      })
    })
    .sort({
      scoreTotal: event.scoreTotal,
      schoolName: -1,
      name: -1,
      creat_time: -1,
    })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .end();
};