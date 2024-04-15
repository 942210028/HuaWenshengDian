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

  return await db.collection("FirstWorks").add({
    data: {
      _openid: wxContext.OPENID,
      author: event.author,
      contacts: event.contacts,
      email: event.email,
      group: event.group,
      instructor: event.instructor,
      instructorPhone: event.instructorPhone,
      introduce: event.introduce,
      isProblem: false,
      judges_id: "",
      name: event.name,
      phone_number: event.phone_number,
      score: {
        socre1: 0, //形体
        socre2: 0, //面部表情
        socre3: 0, //发音
        socre4: 0, //句子表达流畅度
        socre5: 0, //主题完整度
        socre6: 0, //创意度
        socre7: 0, //声音洪亮
        socre8: 0, //关键词的强调
        socre9: 0, //恰当的情绪表达
        socre10: 0, //演讲的内容
      },
      scoreTotal: 0,
      title: event.title,
      titleSource: event.titleSource,
      titleSourceImg: event.titleSourceImg,
      video_url: event.video_url,
      video_thumb: event.video_thumb,
      video_url2: event.video_url2,
      video_thumb2: event.video_thumb2,
      duration: event.duration,
      duration2: event.duration2,
			schoolName: event.schoolName,
			grade: event.grade,
      speciality: event.speciality,
			speechTitle: event.speechTitle,
			recitationTitle: event.recitationTitle,
      creat_time: db.serverDate(),
    },
  });
};
