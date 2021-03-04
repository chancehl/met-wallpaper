const wallpaper = require("wallpaper");

class WallpaperManager {
  static #isWindows = process.platform === "win32";

  static async setWallpaper(path) {
    if (this.#isWindows) {
      await wallpaper.set(path);
    } else {
      await wallpaper.set(path, { scale: "fit" });
    }
  }
}

module.exports = WallpaperManager;
