const fs = require("fs");
const dirTree = require("directory-tree");
const dree = require("dree");
const path = require("path");
var glob = require("glob");
const { v4: uuidv4 } = require("uuid");
const { styledConsole } = require("../utils/util");

module.exports.getDirectoryTree = async function (req, res) {
  console.log("##################### tree ###################");
  try {
    const tree = dirTree(
      "/home/arun/projects/test-project",
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
    styledConsole(tree, "tree out put");

    res.json(tree);
  } catch (err) {
    res.status(400).send(err);
  }
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

module.exports.AddNewFile = async function (req, res) {
  console.log("################## add new file ##################");
  console.log(req.body);
  console.log("################## add new file ##################");

  fs.open(req.body.path + "/" + req.body.newName, "w", function (err, file) {
    if (err) throw err;
    let tree = getTree();
    console.log(tree);
    res.status(201).json(tree);
  });
};

async function getTree() {
  try {
    let tree = dirTree(
      "/home/arun/projects/test-project",
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
    return tree;
  } catch (err) {
    console.log(err);
  }
}
