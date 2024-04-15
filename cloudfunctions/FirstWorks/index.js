const add = require("./add/index");
const count = require("./count/index");
const update = require("./update/index");
const get = require("./get/index");
const getall = require("./getall/index");
const getById = require("./getById/index");
const search = require("./search/index");

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "add":
      return await add.main(event, context);
    case "count":
      return await count.main(event, context);
    case "update":
      return await update.main(event, context);
    case "get":
      return await get.main(event, context);
    case "getall":
      return await getall.main(event, context);
		case "getById":
			return await getById.main(event, context);
    case "search":
      return await search.main(event, context);
  }
};
