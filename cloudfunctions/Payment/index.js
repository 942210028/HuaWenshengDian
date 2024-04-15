// 云函数入口文件
const cloud = require("wx-server-sdk");
const envId = "cloud1-4gojwhjp38f8a41c";
const mchid = "1636076384"; //商户号
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
}); // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  switch (event.type) {
    case "pay":
      console.log("[支付], event, wxContext.OPENID", event, wxContext.OPENID);
      let nonceStr = Math.random().toString(36).substr(2, 13); //32位以内的随机整数，这里是11位
      let timeStamp = parseInt(Date.now() / 1000);
      let outTradeNo = timeStamp + nonceStr; //商户订单号
      let { totalFee } = event;
      let body = "华文盛典"; //商品描述
      let tradeType = "JSAPI";

      //生成预支付订单
      const result = await cloud.cloudPay.unifiedOrder({
        body,
        nonceStr,
        tradeType,
        outTradeNo,
        spbillCreateIp: "127.0.0.1",
        subMchId: mchid,
        totalFee, //订单金额单位为分，必须为整数
        envId,
        functionName: "paymentCB", //接收微信支付异步通知的回调云函数
      });
      result.outTradeNo = outTradeNo;
      //记录预支付交易单信息
      db.collection("Payment").add({
        data: {
          _openid: openid,
          body,
          outTradeNo,
          totalFee,
          status: 0,
          creat_time: db.serverDate(),
          type: "pay",
        },
      });

      return result;

      break;
    case "refund":
      console.log("[退款], event, wxContext.OPENID", event, wxContext.OPENID);
      let { total_fee, refund_fee } = event;
      //生成退款订单
      const refundResult = await cloud.cloudPay.refund({
        nonce_str: Math.random().toString(36).substr(2, 13),
        out_trade_no: event.outTradeNo,
        out_refund_no: event.outTradeNo + "re",
        spbillCreateIp: "127.0.0.1",
        sub_mch_id: mchid,
        total_fee, //订单金额单位为分，必须为整数
        refund_fee, //申请退款金额
        envId: envId,
        functionName: "paymentCB", //接收微信支付异步通知的回调云函数
      });
      //记录退款订单信息
      db.collection("Payment").add({
        data: {
          _openid: openid,
          outRefundNo: event.outTradeNo + "re",
          totalFee: total_fee,
          refund_fee,
          status: 0,
          creat_time: db.serverDate(),
          type: "refund",
        },
      });
      return refundResult;
      break;
    default:
      break;
  }
};
