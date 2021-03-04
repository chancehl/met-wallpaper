#!/usr/bin/env node
const { Command } = require("commander");
const wallpaper = require("wallpaper");
const colors = require("colors");

const RequestManager = require("./api/request-manager");
const ImageHandler = require("./api/image-downloader");

const program = new Command();

program
  .option("-q, --query <query>", "the search term")
  .option("-m, --medium <medium>", "the medium to be returned", "Paintings");

program.parse(process.argv);

// IIFE for allowing top level await
(async function main(options) {
  const query = options.query;

  if (query) {
    const object = await RequestManager.query(query);

    console.log({ ...object });
  } else {
    const object = await RequestManager.get();

    const fileLocation = await ImageHandler.download(object);

    await wallpaper.set(fileLocation, { scale: "fit" });

    console.log(
      `Set desktop background image to ${colors.cyan(object.title)} by ${
        (object.constituents || []).length
          ? object.constituents.join(", ")
          : "Unknown"
      }.`
    );

    // Tell the user this was a successful operation
    console.log(colors.green("Success (exiting)"));

    // Exit successfully
    process.exit(0);
  }
})(program.opts());
