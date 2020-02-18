// Borrowed from https://github.com/ai/nanoid/blob/master/random.js

import * as crypto from "crypto"

let exporter: (bytes: number) => Buffer

if (crypto.randomFillSync) {
    // We reuse buffers with the same size to avoid memory fragmentations
    // for better performance
    const buffers: {[key: number]: Buffer} = {}

    exporter = (bytes: number) => {
        let buffer = buffers[bytes]

        if (!buffer) {
            // `Buffer.allocUnsafe()` faster because it doesn’t clean memory.
            // We do not need it, since we will fill memory with new bytes anyway.
            buffer = Buffer.allocUnsafe(bytes)

            if (bytes <= 255) buffers[bytes] = buffer
        }

        return crypto.randomFillSync(buffer)
    }

} else {
    exporter = crypto.randomBytes
}

export default (bytes: number) => exporter(bytes)
