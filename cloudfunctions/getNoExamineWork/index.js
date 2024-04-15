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
      _id: _.nin(["数据说明",event._id]),
      group: event.group,
      scoreTotal: 0,
      judges_id: event.judges_id
    })
    .sort({
      creat_time: -1,
    })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .end();
};
