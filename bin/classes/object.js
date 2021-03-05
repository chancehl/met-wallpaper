const colors = require("colors");

class Object {
  constructor(object) {
    this.title = object.title;
    this.id = object.objectID;
    this.department = object.department;
    this.period = object.period || "Unknown";
    this.medium = object.medium;
    this.imageUrl = object.primaryImage;
    this.constituents = (object.constituents || []).length
      ? object.constituents
          .map((constituent) => `${constituent.name} (${constituent.role})`)
          .join(", ")
      : "Unknown";
  }

  log() {
    console.log(
      `${colors.cyan(this.title)} by ${colors.cyan(
        this.constituents
      )}. This piece is from the ${colors.cyan(
        this.period
      )} period. It's medium is ${colors.cyan(
        this.medium
      )}. It is currently stored within the Metropolitan Museum of Art's ${colors.cyan(
        this.department
      )} department. (${colors.cyan(this.id)})`
    );
  }
}

module.exports = Object;
