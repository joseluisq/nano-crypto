// Borrowed from https://github.com/ai/nanoid/blob/master/random.browser.js

export default function (bytes: number) {
    return window.crypto.getRandomValues(new Uint8Array(bytes))
}
