module.exports.checkUserBelongsToGroup = async function (req, res, next) {

let session = neo4jUtil.getSession();
let result = await session.run(`match (u:User {name:"Tom"}),(g:Group {name:"nodejs"}) where exists((u)-[:Belongs]->(g)) return u`,

    req.body
);

res.json(result.records);

  next();
};
