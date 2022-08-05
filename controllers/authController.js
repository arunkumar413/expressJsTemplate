const { v4 } = require("uuid");
var { neo4jUtil } = require("../db/neo4jUtil");
// const bcrypt = require("bcrypt");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var { knex } = require("../db/knexfile");
const req = require("express/lib/request");
// var { knexSession } = require("../bin/www");
const { styledConsole } = require("../utils/util");

var { pgConfig } = require("../db/pg");
const { postData, getData } = require("../db/queries");
const res = require("express/lib/response");
const { ResultSummary } = require("neo4j-driver");
var session = require("express-session");
const nodemailer = require("nodemailer");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

/////////////// End of require //////////////////

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
    // let salt = await bcrypt.genSalt(10);
    let salt = crypto.randomBytes(16).toString("hex");

    let hash = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    // let hash = await bcrypt.hash(req.body.password, salt);
    let data = req.body;
    data.password = hash;
    styledConsole(Object.values(data), "req.data");

    let query = {
      text: 'INSERT INTO Users ("email", "password","firstName", "lastName","city","state","country","roles","phone") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      values: Object.values(data),
    };

    let result = await client.query(query);
    let ver = await sendVerificationEmail(data);
    if (ver === true) {
      res.status(201).json(result.rows);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
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

module.exports.SendVerificationEmail = async function (info) {
  styledConsole(info, "send verification");

  try {
    console.log("######## verify email ###################");

    // const auth = new google.auth.GoogleAuth({
    //   keyFile: '/home/arun/projects/expressJsTemplate/googleCredentials.json',
    //   scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.metadata', 'https://www.googleapis.com/auth/gmail.modify'],
    // });

    // const authClient = await auth.getClient();
    // google.options({ auth: authClient });

    // const apis = google.getSupportedAPIs();
    // const gmail = google.gmail('v1');

    // let raw = makeBody('arunkumar413@gmail.com', 'express.test.email123@gmail.com', 'verify your email', 'Here is your verification link');

    // const res = await gmail.users.messages.send({
    //   auth: auth,
    //   userId: 'me',
    //   requestBody: {
    //     raw: raw,
    //   }
    // })

    // styledConsole(await res.json(), 'email response')

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_VERIFICATION_HOST,
      port: process.env.EMAIL_VERIFICATION_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_VERIFICATION_USER_NAME,
        pass: process.env.EMAIL_VERIFICATION_PASSWORD,
      },
    });

    let emailBodyText = `
    Hi There,

    Thanks for registering an account with us:

    Please verify your account by clicking the link below:
    
    http://localhost:5000/${v4()}
    
    Regards,
    Express App Team

    `;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"noreply" <arunkumar413@zohomail.in>',
      to: "arunkumar413@gmail.com",
      subject: "verify your email",
      text: emailBodyText,
      // html: "<b>Hello world?</b>", // html body
    });

    res.send(info);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");

  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}

async function sendVerificationEmail(data) {
  try {
    styledConsole(data, "verification");

    let verificationId = v4();
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_VERIFICATION_HOST,
      port: process.env.EMAIL_VERIFICATION_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_VERIFICATION_USER_NAME,
        pass: process.env.EMAIL_VERIFICATION_PASSWORD,
      },
    });

    let emailBodyText = `Hi ${data.firstName},
    Thanks for registering an account with us:

    Please verify your account by clicking the link below:
  
    http://localhost:5000/verification/${verificationId}
  
    Regards,
    Express App Team

  `;
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"noreply" <arunkumar413@zohomail.in>',
      to: data.email,
      subject: "verify your email",
      text: emailBodyText,
      // html: "<b>Hello world?</b>", // html body
    });

    let client = pgConfig.getClient();

    let query = {
      text: "UPDATE Users SET verification_code=$1 WHERE email=$2",
      values: [verificationId, data.email],
    };

    let result = await client.query(query);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
