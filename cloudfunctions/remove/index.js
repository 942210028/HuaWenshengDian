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

	if(event.user_id){
		db.collection('User').doc(event.user_id).remove()
		db.collection('FirstWorks').where({_openid:event.user_id}).remove()
	}else{
		db.collection('User').doc(wxContext.OPENID).remove()
		db.collection('FirstWorks').where({_openid:wxContext.OPENID}).remove()
	}
};
