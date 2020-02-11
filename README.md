# nano-crypto [![npm](https://img.shields.io/npm/v/printd.svg)](https://www.npmjs.com/package/nano-crypto) [![npm](https://img.shields.io/npm/dt/nano-crypto.svg)](https://www.npmjs.com/package/nano-crypto) [![Build Status](https://travis-ci.org/joseluisq/nano-crypto.svg?branch=master)](https://travis-ci.org/joseluisq/nano-crypto) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Small [Nano ID](https://github.com/ai/nanoid) + [Crypto](https://nodejs.org/api/crypto.html) utility functions.

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add nano-crypto --dev
```

[NPM](https://www.npmjs.com/)

```sh
npm install nano-crypto --save-dev
```

## API

### random

Uses [Nano ID](https://github.com/ai/nanoid) to generate secure random strings.

```ts
import { random } from 'nano-crypto'

random(40).numeric()
// 3531659724881516282463567169208265077954
random(40).hex()
// b6813a57551935ea5f69d693abd1a57a9b7b8448
random(40).alpha())
// uEUoHDftxzpbUQBBwOQKjQdRRpdIThsTMmSztsBs
random(40).alphalower()
// xjqwbtenbxdeilzaukayfzwpzisjjwgmkgjitwzm
random(40).alphaupper()
// RUHVVVOPUAYDCVICUHPPVQJWQFHYTERRGHITAHRF
random(40).alphanumeric()
// 7g9mgBSHVuXNdzyVhWijvTB6ylf6h39kuEaX8GeZ
random(40).custom('ABC')
// AABCABABBABABABAACAACBBBCCCAAABAAAABAACA
```

### digest

Uses [node crypto](https://nodejs.org/api/crypto.html) to generate hash digests.

```ts
import { digest } from 'nano-crypto'

digest('md5').hash('HOLA')
// c6f00988430dbc8e83a7bc7ab5256346
digest('sha1').hash('HOLA')
// 261c5ad45770cc14875c8f46eaa3eca42568104a
digest('sha256').hash('HOLA')
// 73c3de4175449987ef6047f6e0bea91c1036a8599b43113b3f990104ab294a47
digest('sha512').hash('HOLA')
// 5cf58927b41378bcc076b26b3b850a66ebcec3ace74f6b949da5405721dd39488a238f5afff793b5125038bb1dd7184c1c11c47f4844d1ccbb310c9c75893b65
```

### cipher

Uses [node crypto](https://nodejs.org/api/crypto.html) to encrypt data via cipher algorithms.

```ts
import { cipher } from 'nano-crypto'

const key = 'secret_key'
const { encrypt, encrypt } = cipher('aes-128-cbc', key)

const encrypted = encrypt('HOLA')
// fc584c8dd423026c824c7077a38cc387

const decrypted = decrypt(encrypted)
// HOLA
```

## Contributions
Feel free to send some [pull request](https://github.com/joseluisq/nano-crypto/pulls) or [issue](https://github.com/joseluisq/nano-crypto/issues).

## License
MIT license

© 2018-present [Jose Quintana](http://git.io/joseluisq)
