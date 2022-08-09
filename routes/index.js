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
  AddNewDirectory,
  EditDirName,
  GetFileContent,
  SaveFile,
} = require("../controllers/fileSystemController");
const {
  GetCommitHistory,
  GetStatusMatrix,
} = require("../controllers/gitController");
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
router.get("/getdirtree?", getDirectoryTree);
router.put("/rename-file", RenameFile);
router.post("/add-new-file", AddNewFile);
router.post("/add-new-dir", AddNewDirectory);
router.put("/edit-dir-name", EditDirName);
router.get("/get-file-content", GetFileContent);
router.put("/save-file", SaveFile);

//----------------Git routes-----------
router.get("/git/commit-history", GetCommitHistory);
router.get("/git/git-status", GetStatusMatrix);

module.exports = router;
