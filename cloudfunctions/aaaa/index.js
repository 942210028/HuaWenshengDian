const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const $ = db.command.aggregate;
	const _ = db.command;
	return await db.collection("User").where({
		getPrize: _.elemMatch({
			awards: "最佳参与奖"
		})
	})
	.get()

  // const list = await db.collection("FirstWorks")
	// .aggregate()
	// .match({
	// 	scoreSort:  _.gt(30)
	// })
	// .lookup({
	// 	from: "User",
	// 	localField: "_openid",
	// 	foreignField: "_id",
	// 	as: "user"
	// })
	// .sort({
	// 	scoreSort: -1
	// })
	// .limit(1000)
	// .end();
	// for(var i=0;i<=list.list.length;i++){
	// 	// list.list[0].scoreSort = 0
	// 	// if(list.list[i].scoreTotal==list.list[i-1].scoreTotal){
	// 	// 	list.list[i].scoreSort = list.list[i-1].scoreSort
	// 	// }else{
	// 	// 	list.list[i].scoreSort = list.list[i-1].scoreSort+1
	// 	// }
	// 	console.log(list.list[i].name,list.list[i].scoreSort)
	// 	db.collection("User")
  //   .doc(list.list[i]._openid)
  //   .update({
  //     data: {
	// 			getPrize: [
	// 				{
	// 					name: list.list[i].name,
	// 					awards: "最佳参与奖",
	// 					subAwards: "Best Participation Award"
	// 				}
	// 			]
	// 		},
	// 	})
	// }
};
