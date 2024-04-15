const add = require("./add/index");
const get = require("./get/index");
const getbyid = require("./getbyid/index");
const getall = require("./getall/index");
const getunshipped = require("./getunshipped/index");
const search = require("./search/index");
const update = require("./update/index");

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
    case "getunshipped":
      return await getunshipped.main(event, context);
    case "search":
      return await search.main(event, context);
    case "update":
      return await update.main(event, context);
  }
};
