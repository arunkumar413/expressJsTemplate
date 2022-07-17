const fs = require("fs");
const dirTree = require("directory-tree");
const dree = require("dree");

module.exports.getDirectoryTree = async function (req, res) {
  const tree = dirTree("./", {
    exclude: [/node_modules/, /.git/],
    attributes: ["size", "type", "extension"],
  });
  console.clear();
  console.log(tree);

  res.json(tree);
};
