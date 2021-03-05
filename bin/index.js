#!/usr/bin/env node
const { Command } = require('commander')
const colors = require('colors')
const { Spinner } = require('cli-spinner')

const RequestManager = require('./api/request-manager')
const ImageHandler = require('./api/image-downloader')
const WallpaperManager = require('./api/wallpaper-manager')

const spinner = new Spinner('%s Finding a suitable image from the Metropolitan Museum of Art gallery')

spinner.setSpinnerString(18)

const program = new Command()

program.option('-q, --query <query>', 'the search term').option('-m, --medium <medium>', 'the medium to be returned')

program.parse(process.argv)

// IIFE for allowing top level await
;(async function main(options) {
    const query = options.query
    const medium = options.medium

    try {
        // Start loading spinner
        spinner.start()

        if (query) {
            const object = await RequestManager.query(query, medium)

            if (object == null) {
                console.warn(`Could not find any pieces that match query ${query} with medium ${medium}.`)
            } else {
                // Download the image to disk
                const fileLocation = await ImageHandler.download(object)

                // Set the image background
                await WallpaperManager.setWallpaper(fileLocation)

                // Tell the user this was successful
                console.log(colors.green('Success!'))

                // Log the object
                object.log()

                // Exit successfully
                process.exit(0)
            }
        } else {
            // Get a random object from the Met gallery
            const object = await RequestManager.get()

            // Download the image to disk
            const fileLocation = await ImageHandler.download(object)

            // Set the image background
            await WallpaperManager.setWallpaper(fileLocation)

            // Tell the user this was successful
            console.log(colors.green('Success!'))

            // Log the object
            object.log()

            // Exit successfully
            process.exit(0)
        }
    } catch (ex) {
        console.error('Encountered an error while fetching a wallpaper:', ex.message)

        // exit with error
        process.exit(1)
    } finally {
        spinner.stop()
    }
})(program.opts())
