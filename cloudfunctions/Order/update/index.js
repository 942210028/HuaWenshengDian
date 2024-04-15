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
    .collection("Order")
    .doc(event.id)
    .update({
      data: {
        address: event.address,
        group: event.group,
        name: event.name,
        number: event.number,
        outTradeNo: event.outTradeNo,
        phone_number: event.phone_number,
        shipped: event.shipped,
        totalFee: event.totalFee,
        update_time: db.serverDate(),
      },
    });
};
