const cloud = require("wx-server-sdk")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var user_id = event.user_id?event.user_id:cloud.getWXContext().OPENID
    return await db.collection("User").doc(user_id).get()
  } catch (e) {
    console.error(e)
  }
}