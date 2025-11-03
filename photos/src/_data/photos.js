const fs = require("fs");
const path = require("path");

module.exports = function () {
  const photosDir = path.join(__dirname, "../photos");
  const files = fs.readdirSync(photosDir);

  return files
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map((file) => ({
      filename: file,
      title: file.replace(/\.[^.]+$/, ""), // Remove extension
      url: `/photos/${file}`,
    }));
};
