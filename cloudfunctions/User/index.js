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
	return await db
	.collection("User")
	.aggregate()
	.match({
		_id: event.user_id
	})
	.lookup({
		from: "FirstWorks",
		localField: "_id",
		foreignField: "_openid",
		as: "firstWorks"
	})
	.end();
};
