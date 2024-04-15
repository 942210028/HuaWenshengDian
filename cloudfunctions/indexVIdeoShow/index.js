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
    return await db.collection("User").doc("oatQ75Z1_nz6W0XML1OAO2wXeUmg").get()
  } catch (e) {
    console.error(e)
  }
}