const axios = require("axios").default;

const Object = require("../classes/object");
const pickRandom = require("../utils/pick-random");

class RequestManager {
  static #baseRoute = "https://collectionapi.metmuseum.org/public/collection/v1";

  static #searchEndpoint = "/search";
  static #searchUri = this.#baseRoute.concat(this.#searchEndpoint);

  static #objectEndpoint = "/objects";
  static #objectUri = this.#baseRoute.concat(this.#objectEndpoint);

  static getQueryUri(query) {
    return this.#searchUri.concat(`?q=${query}`);
  }

  static getObjectUri(id) {
    return this.#objectUri.concat(`/${id}`);
  }

  static async get() {
    const { data: indexData } = await axios.get(this.#objectUri);

    let object;
    const objectIDs = indexData.objectIDs;

    while (object == null) {
      const randomObjectId = pickRandom(objectIDs);

      const { data: objectData } = await axios.get(
        this.getObjectUri(randomObjectId)
      );

      if (objectData && objectData.primaryImage) {
        object = new Object(objectData);
      }
    }

    return object;
  }

  static query(query) {
    return { query, uri: this.getQueryUri(query) };
  }
}

module.exports = RequestManager;
