const fs = require("fs");
const dirTree = require("directory-tree");
const dree = require("dree");
const path = require("path");
var glob = require("glob");
const { v4: uuidv4 } = require("uuid");

module.exports.getDirectoryTree = async function (req, res) {
  const tree = dirTree(
    "/home/arun/Documents/projects/my-svelte-project",
    {
      exclude: [/node_modules/, /.git/],
      attributes: ["size", "type", "extension"],
    },
    function (item, path, stats) {
      item.id = uuidv4();
    },
    function (item, path, stats) {
      item.id = uuidv4();
    }
  );

  res.json(tree);
};

module.exports.RenameFile = async function (req, res) {
  console.log("rename");
  console.log(req.body);
  res.send("rename");
};
