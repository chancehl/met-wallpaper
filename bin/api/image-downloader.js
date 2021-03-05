const fs = require('fs')
const axios = require('axios').default
const tmp = require('tmp')
const path = require('path')

class ImageHandler {
    static #isDebug = process.env.DEBUG

    static async download(object, destination = null) {
        const response = await axios.get(object.imageUrl, {
            responseType: 'stream',
        })

        let location

        // If destination is null, then we're going to create a tmp directory, else use what the user provided
        if (destination == null) {
            // create tmp dir
            const tmpDir = tmp.dirSync()

            // come up with a file name based on the id
            location = path.join(tmpDir.name, `${object.id}.jpg`)
        } else {
            const destinationExists = fs.existsSync(destination)

            if (destinationExists) {
                location = path.join(destination, `${object.id}-${new Date().toISOString()}.jpg`)
            } else {
                throw new Error(`Specified destination ${destination} does not exist. Please create the directory first and then re-run this program.`)
            }
        }

        // pipe the result into a tmp file on disc
        response.data.pipe(fs.createWriteStream(location))

        // return a new promise that resolves/rejects once the pipe is complete
        return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve(location))

            response.data.on('error', () => reject())
        })
    }
}

module.exports = ImageHandler
