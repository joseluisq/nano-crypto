// Borrowed from https://github.com/ai/nanoid/blob/master/format.js

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
export default function (random: (bytes: number) => Buffer, alphabet: string, size: number): string {
    // We can’t use bytes bigger than the alphabet. To make bytes values closer
    // to the alphabet, we apply bitmask on them. We look for the closest
    // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
    // 30 symbols in the alphabet, we will take 31 (00011111).
    const mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
    // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
    // which is bigger than the alphabet). As a result, we will need more bytes,
    // than ID size, because we will refuse bytes bigger than the alphabet.

    // Every hardware random generator call is costly,
    // because we need to wait for entropy collection. This is why often it will
    // be faster to ask for few extra bytes in advance, to avoid additional calls.

    // Here we calculate how many random bytes should we call in advance.
    // It depends on ID length, mask / alphabet size and magic number 1.6
    // (which was selected according benchmarks).
    const step = Math.ceil(1.6 * mask * size / alphabet.length)
    let id = ""

    while (true) {
        const bytes = random(step)
            // Compact alternative for `for (var i = 0; i < step; i++)`
        let i = step
        while (i--) {
            // If random byte is bigger than alphabet even after bitmask,
            // we refuse it by `|| ''`.
            id += alphabet[bytes[i] & mask] || ""
            // More compact than `id.length + 1 === size`
            if (id.length === +size) return id
        }
    }
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */
