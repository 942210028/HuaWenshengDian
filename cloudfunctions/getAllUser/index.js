const cloud = require("wx-server-sdk")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = _.aggregate
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  const countResult = await db.collection('User').where({
    schoolName: _.exists(true)
  }).count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = await db.collection('User').aggregate().match({
        schoolName: _.exists(true)
      }).lookup({
        from: 'FirstWorks',
        localField: '_id',
        foreignField: '_openid',
        as: 'work',
      }).project({
        _id: 1,
        name: 1,
        phone_number: 1,
        grade: 1,
        speciality: 1,
        schoolName: 1,
        firstWork: $.cond({
          if: $.and([$.arrayElemAt(["$work.video_url2", 0]), $.neq([$.arrayElemAt(["$work.video_url2", 0]), ""])]),
          then: "是",
          else: "否"
        }),
        secondWork: $.cond({
          if: $.and([$.arrayElemAt(["$work.video_url", 0]), $.neq([$.arrayElemAt(["$work.video_url", 0]), ""])]),
          then: "是",
          else: "否"
        }),
        recitationTitle:$.cond({
          if: $.arrayElemAt(["$work.recitationTitle", 0]),
          then: $.arrayElemAt(["$work.recitationTitle", 0]),
          else: "无"
        }),
        a:$.arrayElemAt(["$work.video_url", 0]),
        b:$.arrayElemAt(["$work.video_url2", 0]),
      })
      .skip(i * MAX_LIMIT).limit(MAX_LIMIT).end()
    tasks.push(promise.list)
    console.log(tasks)
    console.log(promise)
  }
  // 等待所有
  return {data:(await Promise.all(tasks)).reduce((acc, cur) => {
    console.log(acc,cur)
    return acc.concat(cur)
  })}
}