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
    .collection("User")
    .aggregate()
    .match({
      type: 4
    })
		.sort({
			update_time: -1
		})
    .limit(100)
    .end();
};
