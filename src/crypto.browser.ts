type CryptoDigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

export async function hash (data: string, algorithm: CryptoDigestAlgorithm) {
    const units = new window.TextEncoder().encode(data)
    return window.crypto.subtle.digest(algorithm, units)
}

export function digest (algorithm: CryptoDigestAlgorithm) {
    return {
        hash: async (data: string) => {
            const arrayBuffer = await hash(data, algorithm)
            const hashArray = Array.from(new Uint8Array(arrayBuffer))
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
            return hashHex
        }
    }
}
