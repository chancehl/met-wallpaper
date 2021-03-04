#!/usr/bin/env node
const { Command } = require("commander");
const wallpaper = require("wallpaper");
const { fileSync: createTmpFileSync } = require("tmp");

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
    console.log(
      "Fetched the following object from the met museum gallery",
      object
    );

    const fileLocation = await ImageHandler.download(object);
    console.log("Downloaded the image to", fileLocation);

    await wallpaper.set(fileLocation, { scale: "fit" });
    console.log("Set image background to", object.title);
  }
})(program.opts());
