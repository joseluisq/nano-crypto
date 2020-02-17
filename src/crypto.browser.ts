type CryptoDigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512"
type CryptoAesAlgoParams = AesCtrParams | AesCbcParams | AesGcmParams

const CRYPTO_ENCRYPT_ALGO = "AES-GCM"
const CRYPTO_ENCRYPT_ALGO_LEN = 256
const CRYPTO_ENCRYPT_HASH_ALGO = "SHA-256"

export async function hash (data: Uint8Array, algorithm: CryptoDigestAlgorithm) {
    return window.crypto.subtle.digest(algorithm, data)
}

export function digest (algorithm: CryptoDigestAlgorithm) {
    return {
        hash: async (data: string) => {
            const units = new window.TextEncoder().encode(data)
            return arrayBufferToHex(await hash(units, algorithm))
        }
    }
}

export function arrayBufferToHex (buf: ArrayBuffer) {
    const hashArray = Array.from(new Uint8Array(buf))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const createIV = (length = 16) => window.crypto.getRandomValues(new Uint8Array(length))

export function AES (algorithm: CryptoAesAlgoParams) {
    const createGcmAlgoParams = () => ({ name: CRYPTO_ENCRYPT_ALGO, iv: createIV() } as AesGcmParams)

    async function encryptFn (data: string | Uint8Array, key: CryptoKey, algo: CryptoAesAlgoParams) {
        return new Promise<[ArrayBuffer, Uint8Array]>(async (resolve, reject) => {
            if (!data) {
                return reject(new TypeError("Data to encrypt not supplied"))
            }

            if (!key) {
                return reject(new TypeError("The key was not specified"))
            }

            if (!algo) {
                return reject(new TypeError("Algorithm was not specified"))
            }

            let units: Uint8Array | undefined = undefined

            if (typeof data === "string") {
                units = new window.TextEncoder().encode(data)
            }

            if (typeof data === "object" && data instanceof Uint8Array) {
                units = data
            }

            if (!units) {
                return reject(new TypeError("Data type to encrypt is not Uint8Array or string"))
            }

            try {
                let iv: Uint8Array | undefined = undefined

                if (!algo.hasOwnProperty("name")) {
                    return reject(new TypeError("Algorithm object doesn't contain property name"))
                }

                // `AesCbcParams` and `AesGcmParams` have an `iv` prop
                if (algo.hasOwnProperty("iv")) {
                    iv = (algo as AesGcmParams).iv as Uint8Array
                }

                // `AesCtrParams` has only a `counter` prop
                if (algo.hasOwnProperty("counter")) {
                    iv = (algo as AesCtrParams).counter as Uint8Array
                }

                if (!iv) {
                    return reject(new TypeError("Algorithm object doesn't contain property iv or counter"))
                }

                const buf = await Promise.resolve(window.crypto.subtle.encrypt(algo, key, units))

                resolve([ buf, iv ])
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * Generates an `AES-GCM` encryption key pair.
     *
     * @param length The length in bits of the key to generate. This must be 128, 192 or 256. Default 256.
     */
    function createGcmKey (length = CRYPTO_ENCRYPT_ALGO_LEN, hash = CRYPTO_ENCRYPT_HASH_ALGO) {
        return window.crypto.subtle.generateKey({
            name: CRYPTO_ENCRYPT_ALGO,
            length,
            hash
        },
        true,
        [ "encrypt", "decrypt" ])
    }

    return {
        createGcmKey,
        createGcmAlgoParams,

        encrypt: (data: string | Uint8Array, key: CryptoKey) => encryptFn(data, key, algorithm),

        encryptGcm: (data: string | Uint8Array, key: CryptoKey) => encryptFn(data, key, createGcmAlgoParams())
    }
}
