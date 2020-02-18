export type CryptoDigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512"
export type CryptoAesAlgoParams = AesCtrParams | AesCbcParams | AesGcmParams
export type DataInput = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array |
                        Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer

interface DataOutput {
    data: DataInput | undefined
    error: Error | undefined
}

const CRYPTO_ENCRYPT_ALGO = "AES-GCM"
const CRYPTO_ENCRYPT_ALGO_LEN = 256
const CRYPTO_ENCRYPT_HASH_ALGO = "SHA-256"

function encodeDataInput (input: string | DataInput) {
    let units: DataInput | undefined = undefined

    const res: DataOutput = {
        data: undefined,
        error: undefined
    }

    if (typeof input === "string") {
        units = new window.TextEncoder().encode(input)
    }

    if (typeof input === "object" && input instanceof Uint8Array) {
        units = input
    }

    if (!units) {
        res.error = new TypeError("Data type to encrypt is not supported. Types supported: Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array, DataView, ArrayBuffer")
    }

    res.data = units

    return res
}

export async function hash (input: string | DataInput, algorithm: CryptoDigestAlgorithm) {
    const { data, error } = encodeDataInput(input)

    if (error || !data) {
        throw error
    }

    return window.crypto.subtle.digest(algorithm, data)
}

export function digest (algorithm: CryptoDigestAlgorithm) {
    return {
        hash: async (data: string | DataInput) => arrayBufferToHex(await hash(data, algorithm))
    }
}

export function arrayBufferToHex (buf: ArrayBuffer) {
    const hashArray = Array.from(new Uint8Array(buf))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const createIV = (length = 16) => window.crypto.getRandomValues(new Uint8Array(length))

export function AES (algorithm: CryptoAesAlgoParams) {
    const createGcmAlgoParams = () => ({ name: CRYPTO_ENCRYPT_ALGO, iv: createIV() } as AesGcmParams)

    async function encryptFn (input: string | DataInput, key: CryptoKey, algo: CryptoAesAlgoParams) {
        return new Promise<[ArrayBuffer, Uint8Array]>(async (resolve, reject) => {
            const { data, error } = encodeDataInput(input)

            if (error || !data) {
                throw error
            }

            if (!key && typeof key !== "object") {
                return reject(new TypeError("The `key` was not provided or is not a valid object type"))
            }

            if (!algo && typeof algo !== "object") {
                return reject(new TypeError("The `algorithm` was not provided or is not a valid object type"))
            }

            try {
                let iv: Uint8Array | undefined = undefined

                if (!algo.hasOwnProperty("name")) {
                    return reject(new TypeError("The `algorithm` object doesn't contain a property name"))
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
                    return reject(new TypeError("The `algorithm` object doesn't contain a property `iv` or `counter`"))
                }

                const buf = await Promise.resolve(window.crypto.subtle.encrypt(algo, key, data))

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
