import { createCipheriv, createDecipheriv, createHash, Hash, randomBytes } from "crypto"

type HexBase64BinaryEncoding = "binary" | "base64" | "hex"
type HexBase64Latin1Encoding = "latin1" | "hex" | "base64"

const CRYPTO_ENCRYPT_ALGO = "aes-256-cbc"

export function hash (data: string, algorithm: string, encoding: HexBase64Latin1Encoding): string {
    const hash: Hash = createHash(algorithm)
    hash.update(data)
    return hash.digest(encoding)
}

export function digest (algorithm: string) {
    return {
        hash: (data: string, encoding: HexBase64Latin1Encoding = "hex") => hash(data, algorithm, encoding)
    }
}

export function encrypt (
    data: string | NodeJS.ArrayBufferView | Buffer,
    algorithm: string,
    key: string | NodeJS.ArrayBufferView | Buffer,
    iv: string | NodeJS.ArrayBufferView | Buffer,
    outEncoding: HexBase64BinaryEncoding = "hex"
): string {
    const cipher = createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(data)
    encrypted = Buffer.concat([ encrypted, cipher.final() ])

    return iv.toString("hex") + ":" + encrypted.toString(outEncoding)
}

export function decrypt (
    data: NodeJS.ArrayBufferView | Buffer,
    algorithm: string,
    key: string | NodeJS.ArrayBufferView | Buffer,
    iv: string | NodeJS.ArrayBufferView | Buffer
): string {
    const decipher = createDecipheriv(algorithm, key, iv)

    let decrypted = decipher.update(data)
    decrypted = Buffer.concat([ decrypted, decipher.final() ])

    return decrypted.toString()
}

export function cipher (algorithm = CRYPTO_ENCRYPT_ALGO) {
    return {
        encrypt,
        decrypt,

        /**
         * Encrypt data using `AES-256-CBC` algorithm.
         *
         * @param data Data to encrypt
         * @param key Key for encrypt data. It must be 256 bits (32 characters)
         */
        encryptAesGcm: (data: string | NodeJS.ArrayBufferView, key: string | NodeJS.ArrayBufferView | Buffer) => {
            const iv = randomBytes(16)

            if (typeof data === "string") {
                data = Buffer.from(data)
            }

            return encrypt(data, algorithm, key, iv, "hex")
        },

        /**
         * Decrypt data using `AES-256-CBC` algorithm.
         *
         * @param data Data to decrypt
         * @param key Key for decrypt data. It must be 256 bits (32 characters)
         */
        decryptAesGcm: (data: string, key: string | NodeJS.ArrayBufferView | Buffer) => {
            const parts = data.split(":")
            const iv = Buffer.from(parts[0], "hex")
            const encryptedData = Buffer.from(parts[1], "hex")

            return decrypt(encryptedData, algorithm, key, iv)
        }
    }
}
