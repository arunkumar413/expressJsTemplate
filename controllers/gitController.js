const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");

module.exports.GetCommitHistory = async function (req, res) {
  console.log("############## Commit History ###############");
  pathToRepo = "/home/arun/projects/openAPI-document-generator";

  let commits = await git.log({
    fs,
    dir: pathToRepo,
    depth: 100,
    ref: "main",
  });
  console.log(commits);
  res.status(200).json(commits);
  
};
