const fs = require('fs')
const axios = require('axios').default
const tmp = require('tmp')
const path = require('path')

class ImageHandler {
    static #isDebug = process.env.DEBUG

    static async download(object) {
        const response = await axios.get(object.imageUrl, {
            responseType: 'stream',
        })

        // create tmp dir
        const tmpDir = tmp.dirSync()

        // come up with a file name based on the id
        const tmpFile = path.join(tmpDir.name, `${object.id}.jpg`)

        // pipe the result into a tmp file on disc
        response.data.pipe(fs.createWriteStream(tmpFile))

        // return a new promise that resolves/rejects once the pipe is complete
        return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve(tmpFile))

            response.data.on('error', () => reject())
        })
    }
}

module.exports = ImageHandler
