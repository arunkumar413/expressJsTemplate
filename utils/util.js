module.exports.styledConsole = function (item, text) {
  console.clear();
  console.log(`############   ${text}   ##########`);
  console.log(item);
  console.log(`############   ${text}   ##########`);
};
