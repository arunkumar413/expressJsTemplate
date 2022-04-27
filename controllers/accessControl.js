let rolesInfo;

var { neo4jUtil } = require("../db/neo4jUtil");

module.exports.getRolesInfo = async function () {
  //get the role in the req
  // get the role of the user in the db
  // get the path of the req.
  // get the access control list
  // check if the role,
  let query = {
    text: "SELECT * FROM sessions where userid=$1",
    values: [],
  };

  rolesInfo = await client.query(query);
};
module.exports.isUserBelongsToGroup = async function (userInfo, groupInfo) {
  let session = neo4jUtil.getSession();
  let result = await session.run(
    `match (u: User),(g:Group) where g.name=$groupName and u.name=$userName create (u)-[b:Belongs]->(g)`,
    req.body
  );
};
