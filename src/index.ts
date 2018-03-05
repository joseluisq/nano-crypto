import { createHash, createCipher, createDecipher, Hash } from 'crypto'
import generate = require('nanoid/generate')

const NUMERIC: string = '0123456789'
const HEX: string = NUMERIC + 'abcdef'
const ALPHA_L: string = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA_U: string = ALPHA_L.toUpperCase()
const ALPHA: string = ALPHA_L + ALPHA_U
const ALPHANUMERIC: string = ALPHA + NUMERIC

type Utf8AsciiBinaryEncoding = 'utf8' | 'ascii' | 'binary'
type HexBase64BinaryEncoding = 'binary' | 'base64' | 'hex'
type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

function random (len: number = 40): any {
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

function hash (data: string, algorithm: string, encoding: HexBase64Latin1Encoding): string {
  const hash: Hash = createHash(algorithm)
  hash.update(data)
  return hash.digest(encoding)
}

function digest (algorithm: string): any {
  return {
    hash: (data: string, encoding: HexBase64Latin1Encoding = 'hex') => hash(data, algorithm, encoding)
  }
}

function encrypt (
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

function decrypt (
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

function cipher (algorithm: string, passwd: string) {
  return {
    encrypt: (
      data: string,
      inEncoding: Utf8AsciiBinaryEncoding = 'utf8',
      outEncoding: HexBase64BinaryEncoding = 'hex'
    ) => encrypt(data, passwd, algorithm, inEncoding, outEncoding),
    decrypt: (
      data: string,
      inEncoding: HexBase64BinaryEncoding = 'hex',
      outEncoding: Utf8AsciiBinaryEncoding = 'utf8'
    ) => decrypt(data, passwd, algorithm, inEncoding, outEncoding)
  }
}

export { random, digest, cipher }
