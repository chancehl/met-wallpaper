const fs = require("fs");
const axios = require("axios").default;
const tmp = require("tmp");
const path = require("path");

class ImageHandler {
  static #isDebug = process.env.DEBUG;

  static async download(object) {
    const response = await axios.get(object.imageUrl, {
      responseType: "stream",
    });

    const tmpDir = tmp.dirSync();
    const tmpFile = path.join(tmpDir.name, `${object.id}.png`);

    response.data.pipe(fs.createWriteStream(tmpFile));

    return tmpFile;
  }
}

module.exports = ImageHandler;
