const { v4 } = require("uuid");
var { neo4jUtil } = require("../db/neo4jUtil");

var { knex } = require("../db/knexfile");
const req = require("express/lib/request");
// var { knexSession } = require("../bin/www");
const { styledConsole } = require("../utils/util");

var { pgConfig } = require("../db/pg");
const { postData, getData } = require("../db/queries");
const res = require("express/lib/response");

module.exports.NeoTest = async function (req, res) {
  let session = neo4jUtil.getSession();
  console.log("55555555555555555neo  4jtest   55555555555555555");

  const result = await session.run(
    `CREATE (u:User {uuid:$id,name:'john'}) RETURN u`,
    { id: v4() }
  );
  res.json(result.records);
};

module.exports.NewGroup = async function (req, res) {
  try {
    let session = neo4jUtil.getSession();
    let data = req.body;

    data.groupId = v4();

    console.log("################### Create Group  ####################");
    console.log(data);
    console.log("################### Create Group  #################");

    let result = await session.run(
      `create (g:Group {groupId:$groupId,name:$name, createdDate:$createdDate, admin:$admin, url:$url }) return g`,
      data
    );

    res.json(result.records);
  } catch (err) {
    console.log(err);
  }
};

module.exports.addUserToGroup = async function (req, res, next) {
  let session = neo4jUtil.getSession();
  let result = await session.run(
    `match (u: User),(g:Group) where g.name=$groupName and u.name=$userName create (u)-[b:Belongs]->(g) return g`,
    req.body
  );

  res.json(result.records);
  next();
};

module.exports.NewMessage = async function (req, res) {
  console.log("########### req body ###########");
  console.log(req.body);
  console.log("########### req body ###########");

  try {
    let session = neo4jUtil.getSession();
    let result = await session.run(
      // ` MATCH (u: User {userId: $senderId}), (v: User{userId:$receiverId}) return u,v`,

      ` MATCH (u: User {userId: $senderId}), (v: User{userId:$receiverId})
        CREATE(m:Message{msgId:$msgId,msg:$msg})
        MERGE(u)-[s1:SENT]->(m)-[s2:SENT_TO]->(v)
        return u,v`,
      // `CREATE (m:Message {messageId:$messageId,msg:$msg})`,

      // `MATCH (u: User {id: $senderId}), (v: User {id: $receiverId})
      // CREATE (u)-[:SENT]->(m:Message {msg: $msg,sentDate:$sentDate})-[:SENT_TO]->(v) return u,v,m`,
      // { messageId: v4(), msg: "Test message" }
      { ...req.body, msgId: v4() }
    );

    console.log("########### New Message ###########");
    console.log(result.records);

    res.json(result.records);
  } catch (err) {
    console.log(err);
  }
};

module.exports.NewUser = async function (req, res) {
  let session = neo4jUtil.getSession();

  try {
    let result = await session.run(
      `CREATE(u:User{userId:$userId,name:$name,city:$city}) return u`,
      { ...req.body, userId: v4() }
    );

    res.json(result.records);
  } catch (err) {
    console.log(err);
  }
};

module.exports.CreateAdmin = async function (req, res) {
  try {
    let session = neo4jUtil.getSession();

    let result = await session.run(
      `match (u:User{userId:$userId}), (g: Group{name:$groupName, groupId: groupId}) create (u)-[a:IS_ADMIN]->(g)`,
      { ...req.body }
    );
  } catch (err) {
    console.log(err);
  }
};
