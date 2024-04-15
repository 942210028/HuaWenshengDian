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
    .collection("FirstWorks")
    .aggregate()
    .match(
      _.or([
        {
          name: db.RegExp({
            regexp: event.text,
            options: 'i',
          }),
        },
        {
          phone_number: db.RegExp({
            regexp: event.text,
            options: 'i',
          }),
        },
      ])
    )
		.sort({
			creat_time: -1
		})
    .limit(1000)
    .end();
};
