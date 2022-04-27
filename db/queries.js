const { get } = require("express/lib/response");
var { pgConfig } = require("../db/pg");
const { styledConsole } = require("../utils/util");

module.exports.dataBaseQueries = {
  createUser: {
    text: "INSERT INTO Users(firstName, lastName,email,city,password) values($1,$2)",
    values: [
      "Arun",
      "Kadari",
      "arunkumar413@gmail.com",
      "Karimnagar",
      "fgfgfgfd",
    ],
  },
};

module.exports.postData = async function (postConfig) {
  let client = pgConfig.getClient();
  let query = {
    text: `INSERT INTO ${postConfig.tableName}(name, email) VALUES($1, $2)`,
    values: Object.values(postConfig.data),
  };

  try {
    let result = await client.query(query);
    styledConsole(result.rows, 4444);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getData = async function (getConfig) {
  debugger;
  let result;
  try {
    let client = pgConfig.getClient();

    let query = {
      text: `SELECT ${getConfig.data.columns[0]},${getConfig.data.columns[1]},${getConfig.data.columns[2]} from ${getConfig.tableName}`,
      // values: getConfig.data.values,
    };

    debugger;
    result = await client.query(query);
  } catch (err) {
    console.log(err.stack);
  }

  return result.rows;
};

module.exports.getDataById = async function (getConfig) {
  debugger;
  let result;
  try {
    let client = pgConfig.getClient();

    let query = {
      text: `SELECT ${getConfig.data.columns[0]},${getConfig.data.columns[1]},${getConfig.data.columns[2]} from ${getConfig.tableName}`,
      // values: getConfig.data.values,
    };

    debugger;
    result = await client.query(query);
  } catch (err) {
    console.log(err.stack);
  }

  return result.rows;
};
