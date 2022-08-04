const fs = require("fs");
var fsPromises = fs.promises;
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
  console.log("############## rename file ##################");
  try {
    let prevPath = req.body.path;
    let newFileName = req.body.newName;
    let pathArr = prevPath.split("/");
    let slice = pathArr.slice(1, pathArr.length - 1);
    var newPath = "";
    slice.forEach(function (item) {
      newPath = newPath + "/" + item;
    });
    let pathWithFileName = newPath + "/" + newFileName;

    let result = await fsPromises.rename(prevPath, pathWithFileName);
    let tree = await getTree();
    res.status(200).json(tree);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.AddNewFile = async function (req, res) {
  try {
    let result = await fsPromises.open(
      req.body.path + "/" + req.body.newName,
      "w"
    );
    console.log(result);
    let tree = await getTree();
    res.status(201).json(tree);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.AddNewDirectory = async function (req, res) {
  try {
    let result = fsPromises.mkdir(req.body.path + "/" + req.body.newName);
    let tree = await getTree();
    res.status(201).json(tree);
  } catch (err) {
    req.status(400).json(err);
  }
};

module.exports.EditDirName = async function (req, res) {
  try {
    var pathArr = req.body.path.split("/");
    pathArr.pop();
    let newPath = pathArr.join("/");
    let result = fsPromises.rename(
      req.body.path,
      newPath + "/" + req.body.newName
    );
    let tree = await getTree();
    res.status(201).json(tree);
  } catch (err) {
    req.status(400).json(err);
  }
};

module.exports.GetFileContent = async function (req, res) {
  console.log("##########  GET file content ###############");
  console.log(req.query);
  try {
    const data = fs.readFileSync(req.query.path, "utf8");
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.SaveFile = async function (req, res) {
  console.log("################## Save file #############");
  console.log(req.body);
  try {
    fs.writeFile(req.body.node.path, req.body.fileContent, function (err) {
      if (err) throw err;
      console.log("Replaced!");
      const data = fs.readFileSync(req.body.node.path, "utf8");
      res.status(200).json(data);
    });
  } catch (err) {
    res.status(400).json(err);
  }
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
