var express = require("express");
var {
  Login,
  Logout,
  Register,
  NewApp,
  NeoTest,
  createGroup,
  addUserToGroup,
  VerifyEmail,
  SendVerificationEmail,
} = require("../controllers/authController");
const {
  NewMessage,
  NewUser,
  NewGroup,
} = require("../controllers/chatController");
const {
  getFileSystem,
  getDirectoryTree,
  RenameFile,
  AddNewFile,
} = require("../controllers/fileSystemController");
var router = express.Router();

/* GET home page. */
router.get("/test", function (req, res, next) {
  console.log("############# Headers ###################3");
  console.log(req.headers);
  console.log("############# Headers ###################3");

  res.json({ title: "Express" });
});
// router.get("/login", Login);
router.post("/login", Login);
router.get("/logout", Logout);
router.post("/register", Register);
router.get("/verify-email", SendVerificationEmail);
router.post("/newapp", NewApp);

//-------------------Chat Routes--------------
router.post("/neo4jtest", NeoTest);
router.post("/new-user", NewUser);

router.post("/create-group", NewGroup);
router.post("/add-user-to-group", addUserToGroup);
router.post("/new-message", NewMessage);

//--------------------file system routes------------------------
router.get("/getdirtree", getDirectoryTree);
router.put("/rename-file", RenameFile);
router.post("/add-new-file", AddNewFile);

module.exports = router;
