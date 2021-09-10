module.exports = function pickRandom(array, opts) {
    const max = opts?.max ?? array.length
    const min = opts?.min ?? 0

    const randomIndex = Math.floor(Math.random() * (max - min) + min)

    return array[randomIndex]
}
