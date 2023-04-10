const fs = require("fs");
const path = require("path");

module.exports = async (startingWith) => {
  const directoryPath = path.join(__dirname, "public", "files");

  try {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      if (file.startsWith(startingWith)) {
        await fs.promises.unlink(path.join(directoryPath, file));
      }
    }
  } catch (error) {
    console.error(`Error deleting meeting files: ${error}`);
  }
};
