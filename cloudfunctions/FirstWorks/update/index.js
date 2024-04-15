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
	console.log(event)
  return await db
    .collection("FirstWorks")
    .doc(event.id)
    .update({
      data: {
				author: event.author,
				contacts: event.contacts,
				email: event.email,
				group: event.group,
				instructor: event.instructor,
				instructorPhone: event.instructorPhone,
        introduce: event.introduce,
        isProblem: event.isProblem,
				judges_id: event.judges_id,
				name: event.name,
				phone_number: event.phone_number,
        score: event.score,
        scoreTotal: event.scoreTotal,
				title: event.title,
				titleSource: event.titleSource,
        titleSourceImg: event.titleSourceImg,
				video_url: event.video_url,
				video_thumb: event.video_thumb,
				video_url2: event.video_url2,
				video_thumb2: event.video_thumb2,
				duration: event.duration,
				duration2: event.duration2,
				grade: event.grade,
				schoolName: event.schoolName,
				speciality: event.speciality,
				speechTitle: event.speechTitle,
				recitationTitle: event.recitationTitle,
        update_time: db.serverDate(),
      },
    });
};
