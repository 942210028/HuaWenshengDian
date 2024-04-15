const search = require("./search/index");
const getall = require("./getall/index");
const getJudge = require("./getJudge/index");

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "add":
      return await add.main(event, context);
    case "get":
      return await get.main(event, context);
    case "getbyid":
      return await getbyid.main(event, context);
    case "getall":
      return await getall.main(event, context);
    case "getJudge":
      return await getJudge.main(event, context);
    case "search":
      return await search.main(event, context);
    case "update":
      return await update.main(event, context);
  }
};
