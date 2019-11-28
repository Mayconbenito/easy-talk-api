const fs = require("fs");
const path = require("path");

const validators = {};

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js"
  )
  .forEach(file => {
    const fileName = file.replace(".js", "");
    const fileImport = require(path.resolve(__dirname, file));
    validators[fileName] = fileImport;
  });

module.exports = validators;
