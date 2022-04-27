const neo4j = require("neo4j-driver");

var neo4jDriver;

module.exports.neo4jUtil = {
  connectToDB: function () {
    neo4jDriver = neo4j.driver(
      "bolt://localhost:7687",
      neo4j.auth.basic("neo4j", "kumar"),
      {}
    );
  },

  getSession: function () {
    let session = neo4jDriver.session({
      database: "neo4j",
    });

    return session;
  },
};
