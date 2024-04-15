// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page: event.page,
      check_path: false,
      is_hyaline: false
    });
    const uploadResult = await cloud.uploadFile({
      cloudPath: event.cloudPath,
      fileContent: wxacodeResult.buffer,
    });
    return uploadResult.fileID;
    // return await cloud.openapi.urllink.generate({
    //   "path": '/pages/index/index',
    //   "isExpire": false,
    // })
  } catch (err) {
    return err
  }
}