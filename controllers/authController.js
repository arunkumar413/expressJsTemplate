const { v4 } = require("uuid");
var { neo4jUtil } = require("../db/neo4jUtil");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var { knex } = require("../db/knexfile");
const req = require("express/lib/request");
var { knexSession } = require("../bin/www");
const { styledConsole } = require("../utils/util");

var { pgConfig } = require("../db/pg");
const { postData, getData } = require("../db/queries");
const res = require("express/lib/response");
const { ResultSummary } = require("neo4j-driver");
var session = require("express-session");

module.exports.Authenticate = async function (req, res) {
  try {
    let client = pgConfig.getClient();
    let params = [];
    params.push(req.body.email);

    let query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: params,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports.Login = async function (req, res) {
  try {
    let client = pgConfig.getClient();
    let params = [];
    params.push(req.body.email);

    // console.log("##############Login ###############")

    let query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: params,
    };

    let result = await client.query(query);
    if (result.rows && result.rows.length) {
      let hashedPassword = result.rows[0].password;
      let isPasswordOk = await bcrypt.compare(
        req.body.password,
        hashedPassword
      );

      console.log(isPasswordOk);
      if (isPasswordOk) {
        // check if session already exists

        let checkSessionQuery = {
          text: "SELECT * from sessions where userid=$1",
          values: [result.rows[0].id],
        };

        let sessionQueryResult = await client.query(checkSessionQuery);

        if (sessionQueryResult.rows.length) {
          let sessionID = v4();
          req.session.sessionID = sessionID;
          req.session.userEmail = req.body.email;

          let updateQuery = {
            text: "UPDATE sessions SET sessionid=$1, login_date=$2 WHERE userid=$3",
            values: [sessionID, new Date().toISOString(), result.rows[0].id],
          };
          let updatedResult = await client.query(updateQuery);
          console.log("############# Updated Successfully ###############");
          res.status(200).json(updatedResult.rows);
        } else {
          let sessionID = v4();
          req.session.sessionID = sessionID;
          req.session.userEmail = req.body.email;

          let insertQuery = {
            text: "INSERT INTO sessions (sessionid,login_date,userid) VALUES($1,$2,$3)",
            values: [sessionID, new Date().toISOString(), result.rows[0].id],
          };
          let insertResult = await client.query(insertQuery);
          res.status(201).json(insertResult.rows);
        }
      } else {
        res.status(401).json({ error: "cannot find username or password" });
      }
    } else {
      res.json({ error: "user not found" });
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports.Logout = async function (req, res) {
  try {
    res.send("logout");
  } catch (err) {}
};

module.exports.Register = async function (req, res) {
  try {
    let client = pgConfig.getClient();

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    let data = req.body;
    data.password = hash;

    let query = {
      text: 'INSERT INTO Users ("email", "password","firstName", "lastName","city") VALUES($1, $2,$3,$4,$5)',
      values: Object.values(req.body),
    };

    let result = await client.query(query);

    res.json(result.rows);
  } catch (err) {
    res.send(err);
  }
};

module.exports.NewApp = async function (req, res) {
  try {
    let client = pgConfig.getClient();

    let query = {
      text: 'INSERT INTO Apps ("appName", "appWebsite","redirectURL", "clientID") VALUES($1, $2,$3,$4)',
      values: Object.values(req.body),
    };

    styledConsole(req.body, 66666);
    let result = await client.query(query);
    styledConsole(result.rows, 4444);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports.checkAccess = async function (req, res, next) {
  let query = {
    text: "SELECT * FROM users where userid=$1",
    values: [],
  };

  let accesControlList = [
    { path: "/", resource: "Message", roles: ["user", "admin"] },
    { path: "/admin", resource: "User", roles: ["admin"] },
    { path: "/message", resource: "Message", roles: ["admin", "user"] },
    { path: "/group", resource: "Message", roles: ["admin", "user"] },
    { path: "/group/:id", resource: "Group", roles: ["admin", "user"] },
  ];

  let result = await client.query(query);

  let filteredPaths = accesControl.filter(function (item, index) {
    item.path === req.path; //get filtered access control list that macthes the req path
  });

  let filteredRoles = filteredPaths[0].roles.map(function (item, index) {
    if (result.rows[0].roles.contains(item)) {
      // compare the role of user in db with the access control list role
      return item;
    } else return null;
  });

  if (filteredRoles.length) {
    next();
  } else {
    res.status(403);
  }
};

module.exports.NeoTest = async function (req, res) {
  let session = neo4jUtil.getSession();
  console.log("55555555555555555neo  4jtest   55555555555555555");

  const result = await session.run(
    `CREATE (u:User {uuid:$id,name:'john'}) RETURN u`,
    { id: v4() }
  );
  res.json(result.records);
};

module.exports.createGroup = async function (req, res) {
  let session = neo4jUtil.getSession();
  let result = await session.run(
    `create (g:Group {name:$name, createdDate:$createdDate, admin:$admin, url:$url }) return g`,
    { ...req.body }
  );

  res.json(result.records);
};

module.exports.addUserToGroup = async function (req, res) {
  let session = neo4jUtil.getSession();
  let result = await session.run(
    `match (u: User),(g:Group) where g.name=$groupName and u.name=$userName create (u)-[b:Belongs]->(g)`,
    req.body
  );

  res.json(result.records);
};
