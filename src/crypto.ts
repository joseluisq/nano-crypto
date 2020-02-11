import { createCipher, createDecipher, createHash, Hash } from "crypto"

type Utf8AsciiBinaryEncoding = "utf8" | "ascii" | "binary"
type HexBase64BinaryEncoding = "binary" | "base64" | "hex"
type HexBase64Latin1Encoding = "latin1" | "hex" | "base64"

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
    data: string,
    password: string,
    algorithm: string,
    inEncoding: Utf8AsciiBinaryEncoding,
    outEncoding: HexBase64BinaryEncoding
): string {
    const cipher = createCipher(algorithm, password)

    let crypted = cipher.update(data, inEncoding, outEncoding)
    crypted += cipher.final(outEncoding)

    return crypted
}

export function decrypt (
    data: string,
    password: string,
    algorithm: string,
    inEncoding: HexBase64BinaryEncoding,
    outEncoding: Utf8AsciiBinaryEncoding
): string {
    const cipher = createDecipher(algorithm, password)

    let crypted: string = cipher.update(data, inEncoding, outEncoding)
    crypted += cipher.final(outEncoding)

    return crypted
}

export function cipher (algorithm: string, passwd: string) {
    return {
        encrypt: (
            data: string,
            inEncoding: Utf8AsciiBinaryEncoding = "utf8",
            outEncoding: HexBase64BinaryEncoding = "hex"
        ) => encrypt(data, passwd, algorithm, inEncoding, outEncoding),

        decrypt: (
            data: string,
            inEncoding: HexBase64BinaryEncoding = "hex",
            outEncoding: Utf8AsciiBinaryEncoding = "utf8"
        ) => decrypt(data, passwd, algorithm, inEncoding, outEncoding)
    }
}
