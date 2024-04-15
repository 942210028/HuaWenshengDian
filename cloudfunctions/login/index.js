// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    const wxContext = cloud.getWXContext();
    let user_id_result = await db
      .collection("User")
      .where({
        _id: wxContext.OPENID,
      })
      .field({
        _id: true,
      })
      .get();

    if (user_id_result.data && user_id_result.data.length > 0) {
      const user_id = user_id_result.data[0]._id;
      return user_id;
    } else {
      return await db.collection("User").add({
        data: {
					_id: wxContext.OPENID,
          open_id: wxContext.OPENID,
          name: event.userData.data.nickName,
          gender: event.userData.data.gender,
          avatar_url: event.userData.data.avatarUrl,
          app_id: wxContext.APPID,
          create_time: db.serverDate(),
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
};
