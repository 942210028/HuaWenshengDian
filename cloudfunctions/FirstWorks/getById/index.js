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
	const scoreTotal = await db.collection("FirstWorks").doc(event._id).get()
	const soreSort = await db.collection('FirstWorks').where({
		scoreTotal: _.gt(scoreTotal.data.scoreTotal)
	}).count()
	console.log(soreSort)
  return await db
    .collection("FirstWorks")
    .aggregate()
    .match({
      _id: event._id
    })
    .lookup({
      from: "User",
      localField: "_openid",
      foreignField: "_id",
      as: "user"
    })
    .addFields({
			avatar_url: $.arrayElemAt(["$user.avatar_url", 0]),
			scoreSort: Number(soreSort.total)+1
    })
    .limit(1000)
    .end();
};
