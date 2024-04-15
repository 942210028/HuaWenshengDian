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
    .match(
      _.or([
        {
          name: db.RegExp({
            regexp: event.text,
            options: 'i',
          }),
        },
        {
          schoolName: db.RegExp({
            regexp: event.text,
            options: 'i',
          }),
        },
        {
          speciality: db.RegExp({
            regexp: event.text,
            options: 'i',
          }),
        },
      ])
    ).match({
			_id: _.neq("数据说明"),
			speciality: _.exists(true),
			update_time:  _.exists(true),
		})
		.sort({
			schoolName: -1,
			speciality: -1,
			update_time: -1
		})
    .limit(5000)
    .end();
};
