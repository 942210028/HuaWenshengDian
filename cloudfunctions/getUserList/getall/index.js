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
  const totalCount = await db.collection("User").where({name: _.neq("微信用户")}).count();
  return await db
    .collection("User")
    .aggregate()
    .match({
			_id: _.neq("数据说明"),
			speciality: _.exists(true),
			update_time:  _.exists(true),
    })
    .addFields({
      totalCount:totalCount.total
    })
		.sort({
			schoolName: -1,
			speciality: -1,
			update_time: -1
		})
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .end();
};
