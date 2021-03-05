const wallpaper = require('wallpaper')
const colors = require('colors')

class WallpaperManager {
    static #isWindows = process.platform === 'win32'
    static #isDebug = process.env.DEBUG

    static async setWallpaper(path) {
        if (this.#isDebug) {
            console.log(`\n[${colors.yellow('DEBUG')}]: Debug mode is active. Not setting wallpaper. Path: ${path}.`)

            return
        }

        if (this.#isWindows) {
            await wallpaper.set(path)
        } else {
            await wallpaper.set(path, { scale: 'fit' })
        }
    }
}

module.exports = WallpaperManager
