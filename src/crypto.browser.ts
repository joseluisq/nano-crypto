type CryptoDigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512"

const CRYPTO_ENCRYPT_ALGO = "AES-GCM"
const CRYPTO_ENCRYPT_ALGO_LEN = 256
const CRYPTO_ENCRYPT_HASH_ALGO = "SHA-256"

function arrayBufferToHex (buf: ArrayBuffer) {
    const hashArray = Array.from(new Uint8Array(buf))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

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

/**
 * Generates an `RSA-OAEP` encryption key pair.
 * Note: Consider using a 4096-bit key (modulusLength) for systems that require long-term security
 *
 * @param modulusLength The length in bits of the RSA modulus. This should be at least 2048. Default 2048.
 * @param hash A DOMString representing the name of the digest function to use.
 * It can pass any of SHA-256, SHA-384, or SHA-512. Default SHA-256.
 */
function generateRsaKey (modulusLength = 2048, hash = CRYPTO_ENCRYPT_HASH_ALGO) {
    return window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        publicExponent: new Uint8Array([ 1, 0, 1 ]),
        modulusLength,
        hash
    },
    true,
    [ "encrypt", "decrypt" ])
}

/**
 * Generates an `AES-GCM` encryption key pair.
 *
 * @param length The length in bits of the key to generate. This must be 128, 192 or 256. Default 256.
 */
function generateAesKey (length = CRYPTO_ENCRYPT_ALGO_LEN, hash = CRYPTO_ENCRYPT_HASH_ALGO) {
    return window.crypto.subtle.generateKey({
        name: CRYPTO_ENCRYPT_ALGO,
        length,
        hash
    },
    true,
    [ "encrypt", "decrypt" ])
}

export function encrypt (
    data: Uint8Array,
    algorithm: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams,
    publicKey: CryptoKey
) {
    return Promise.resolve(window.crypto.subtle.encrypt(algorithm, publicKey, data))
}

export function cypher (
    algorithm?: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams
) {
    function defaultAesGcmParams () {
        // The iv must never be reused with a given key.
        const iv = window.crypto.getRandomValues(new Uint8Array(12))

        return {
            name: CRYPTO_ENCRYPT_ALGO,
            iv
        }
    }

    async function encryptFn (
        data: string,
        publicKey: CryptoKey,
        algo: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams
    ) {
        const units = new window.TextEncoder().encode(data)
        return arrayBufferToHex(await encrypt(units, algo, publicKey))
    }

    return {
        generateAesKey,
        generateRsaKey,

        encrypt: (data: string, publicKey: CryptoKey) => {
            if (!algorithm) {
                throw new Error("Algorithm was not provided.")
            }

            return encryptFn(data, publicKey, algorithm)
        },

        encryptAesGcm: async (data: string, publicKey: CryptoKey) => {
            return encryptFn(data, publicKey, defaultAesGcmParams())
        }
    }
}
