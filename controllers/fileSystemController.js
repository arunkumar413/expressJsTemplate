const fs = require("fs");
const dirTree = require("directory-tree");
const dree = require("dree");
const path = require("path");
var glob = require("glob");
const { v4: uuidv4 } = require("uuid");

module.exports.getDirectoryTree = async function (req, res) {
  const tree = dirTree(
    "./",
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

  // let dir = "./";

  // var dirTree = { name: "home", path: "/", children: [] };

  // function traverse(node) {
  //   var files = fs.readdirSync(node);
  //   console.log(files);

  //   files.forEach(function (item) {
  //     let next = path.join(node, item);
  //     dirTree.children.push(item);
  //     if (fs.lstatSync(next).isDirectory()) {
  //       traverse(next);
  //     }
  //   });
  // }

  // traverse(dir);
};
