import { randomBytes } from "crypto"
import { cipher } from "./crypto"

describe("cipher function tests", () => {
    it("should be encrypted", () => {
        const { encryptAesGcm, decryptAesGcm } = cipher()

        const key = randomBytes(32)
        const encrypted = encryptAesGcm("HOLA", key)
        expect(encrypted).toBeTruthy()
        expect(encrypted.length).toBe(65)

        const decrypted = decryptAesGcm(encrypted, key)
        expect(decrypted).toEqual("HOLA")
        expect(decrypted.length).toBe(4)

    })
})
