#!/usr/bin/env node
const { Command } = require('commander')
const { Spinner } = require('cli-spinner')
const colors = require('colors')

const RequestManager = require('./api/request-manager')
const ImageHandler = require('./api/image-downloader')
const WallpaperManager = require('./api/wallpaper-manager')

const program = new Command()

program
    .option('-q, --query <query>', 'the search term')
    .option('-m, --medium <medium>', 'the medium to be returned')
    .option('-d, --destination <destination>', 'the destination to save the image (default is tmp dir)')

program.parse(process.argv)

// IIFE for allowing top level await
;(async function main(options) {
    const query = options.query
    const medium = options.medium
    const destination = options.destination

    const spinnerBase = `%s Finding a suitable image from the Metropolitan Museum of Art gallery`
    const spinnerForQuery = spinnerBase.concat(` for query ${colors.cyan(query)}`)

    const spinner = new Spinner(query == null ? spinnerBase : spinnerForQuery)

    spinner.setSpinnerString(18)

    try {
        // Start loading spinner
        spinner.start()

        let object

        // If the query is null, we're going to just pick a random object. Else, search for what was given
        if (query == null) {
            object = await RequestManager.get()
        } else {
            object = await RequestManager.query(query, medium)
        }

        // If object was null at this point it means the users's query returned no results and we should exit unsuccessfully (defer to catch block)
        if (object == null) {
            throw new Error(`Could not find any pieces that match query ${query} with medium ${medium}.`)
        }

        // Tell the user we're now downloading
        spinner.setSpinnerTitle(`%s Downloading image (id: ${object.id}) to disk at ${destination}`)

        // Download the image to disk
        const fileLocation = await ImageHandler.download(object, destination)

        // Set the image background
        await WallpaperManager.setWallpaper(fileLocation)

        // Tell the user this was successful
        console.log(colors.green('Success!'))

        // Log the object
        object.log()

        // Exit successfully
        process.exit(0)
    } catch (ex) {
        console.error(`\n[${colors.red('ERROR')}]: Encountered an error while fetching a wallpaper:`, ex.message)

        // exit with error
        process.exit(1)
    } finally {
        spinner.stop()
    }
})(program.opts())
