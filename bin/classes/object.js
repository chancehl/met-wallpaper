const colors = require('colors')

class Object {
    constructor(object) {
        this.title = object.title
        this.id = object.objectID
        this.department = object.department
        this.period = object.period || 'Unknown'
        this.medium = object.medium
        this.imageUrl = object.primaryImage
        this.constituents = (object.constituents || []).length ? object.constituents.map((constituent) => `${constituent.name} (${constituent.role})`).join(', ') : 'Unknown'
    }

    log() {
        const title = colors.cyan(this.title)
        const constituents = colors.cyan(this.constituents)
        const period = colors.cyan(this.period)
        const medium = colors.cyan(this.medium)
        const dept = colors.cyan(this.department)
        const id = colors.cyan(this.id)

        console.log(
            `${title} by ${constituents}. This piece is from the ${period} period. It's medium is ${medium}. It is currently stored within the Metropolitan Museum of Art's ${dept} department. (${id})`,
        )
    }
}

module.exports = Object
