import nanoidFormat from "./nanoid/format.browser"
import nanoidRandom from "./nanoid/random.browser"
import { ALPHA, ALPHANUMERIC, ALPHA_L, ALPHA_U, HEX, NUMERIC } from "./shared/alphabets"

const generate = (alphabet: string, size: number) => nanoidFormat(nanoidRandom, alphabet, size)

export function random (len = 40) {
    return {
        hex: () => generate(HEX, len),
        alpha: () => generate(ALPHA, len),
        alphalower: () => generate(ALPHA_L, len),
        alphaupper: () => generate(ALPHA_U, len),
        numeric: () => generate(NUMERIC, len),
        alphanumeric: () => generate(ALPHANUMERIC, len),
        custom: (alphabet: string) => generate(alphabet, len)
    }
}
