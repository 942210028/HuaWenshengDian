// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database();
    const $ = db.command.aggregate;
    const _ = db.command;
    const wxContext = cloud.getWXContext();
    console.log("event", event);
    let user_id = event.user_id?event.user_id:wxContext.OPENID
    if(event.getPrize){
      await db
      .collection("User")
      .doc(user_id)
      .update({
        data: {
          getPrize: _.addToSet(event.getPrize)
        }
      })
    }
    return await db
      .collection("User")
      .doc(user_id)
      .update({
        data: {
					grade: event.grade,
				  addressName: event.addressName,
					addressPhone: event.addressPhone,
          city: event.city,
          address: event.address,
          avatar_url: event.avatar_url,
          contacts: event.contacts,
          email: event.email,
          group: event.group,
					speciality: event.speciality,
          instructor: event.instructor,
          instructorPhone: event.instructorPhone,
          name: event.name,
					phone_number: event.phone_number,
					schoolName: event.schoolName,
          school: event.school,
					type: event.type,
          teacherCode: event.teacherCode,
          is_buyMagazine: event.is_buyMagazine,
          update_time: db.serverDate(),
        },
      });
  } catch (e) {
    console.error(e);
  }
};