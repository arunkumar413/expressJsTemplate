const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");

module.exports.GetCommitHistory = async function (req, res) {
  console.log("############## Commit History ###############");
  // pathToRepo = "/home/arun/projects/openAPI-document-generator";

  console.log(req.query);

  try {
    let commits = await git.log({
      fs,
      dir: req.query.project,
      depth: 100,
      ref: "main",
    });
    res.status(200).json(commits);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports.GetStatusMatrix = async function (req, res) {
  try {
    let status = await git.statusMatrix({
      fs,
      dir: req.query.project,
      filter: (f) => f.startsWith("src/"),
    });
    res.status(200).json(status);
  } catch (err) {
    res.status(400).json(err);
  }
};
