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
  let prevPath = req.body.path;
  let newFileName = req.body.newName;
  let pathArr = prevPath.split("/");
  let slice = pathArr.slice(1, pathArr.length - 1);
  var newPath = "";
  slice.forEach(function (item) {
    newPath = newPath + "/" + item;
  });
  let pathWithFileName = newPath + "/" + newFileName;
  fs.rename(prevPath, pathWithFileName, function (err) {
    if (err) {
      console.log(err);
    } else {
      const tree = dirTree(
        "/home/arun/Documents/projects/my-svelte-project",
        {
          exclude: [/node_modules/, /.git/, /.vscode/],
          attributes: ["size", "type", "extension"],
        },
        function (item, path, stats) {
          item.id = uuidv4();
        },
        function (item, path, stats) {
          item.id = uuidv4();
        }
      );
      console.log(tree);
      res.json(tree);
    }
  });
};
