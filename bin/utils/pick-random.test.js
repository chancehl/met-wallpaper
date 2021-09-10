const pickRandom = require('./pick-random')

describe('pickRandom', () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    test('picks a random element from the array', () => {
        const result = pickRandom(array)

        expect(array).toContain(result)
    })

    test('respects the opts.max parameter', () => {
        const result = pickRandom(array, { max: 5 })
        const index = array.indexOf(result)

        expect(index).toBeLessThanOrEqual(5)
    })

    test('respects the opts.min parameter', () => {
        const result = pickRandom(array, { min: 5 })
        const index = array.indexOf(result)

        expect(index).toBeGreaterThanOrEqual(5)
    })

    test('respects the opts.min & opts.max parameter when both are provided', () => {
        const result = pickRandom(array, { min: 5, max: 10 })
        const index = array.indexOf(result)

        expect(index).toBeGreaterThanOrEqual(5)
        expect(index).toBeLessThanOrEqual(10)
    })
})
