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
    const wxContext = cloud.getWXContext();
    const userInfo = await db.collection("User").doc(wxContext.OPENID).get()
    const uploadTime = await db.collection("FirstWorks")
    .where({
      _openid: wxContext.OPENID,
    })
    .count();
    console.log(userInfo.data)
    console.log(uploadTime.total)
    if(userInfo.data.type==1){
      return 1-uploadTime.total
    }else if(userInfo.data.type==2){
      return 5-uploadTime.total
    }else if(userInfo.data.type==3){
      return 1-uploadTime.total
    }
  } catch (e) {
    console.error(e)
  }
}