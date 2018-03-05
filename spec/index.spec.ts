import { random } from '../src'

describe('nano-crypto', () => {
  describe('random', () => {
    it('should be a random numeric', () => {
      const n = random(40).numeric()
      expect(n).toBeTruthy()
      expect(!isNaN(n)).toBeTruthy()
      expect(n.toString().length).toBe(40)
    })

    it('should be a random hexadecimal', () => {
      const x = random(40).hex()
      expect(/[0-9A-Fa-f]{6}/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })

    it('should be a random alpha', () => {
      const x = random(40).alpha()
      expect(/^[a-zA-Z()]+$/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })

    it('should be a random alphalower', () => {
      const x = random(40).alphalower()
      expect(/^[a-z()]+$/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })

    it('should be a random alphaupper', () => {
      const x = random(40).alphaupper()
      expect(/^[A-Z()]+$/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })

    it('should be a random alphanumeric', () => {
      const x = random(40).alphanumeric()
      expect(/^[0-9a-zA-Z()]+$/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })

    it('should be a custom random', () => {
      const x = random(40).custom('aBc')
      expect(/^(?=.*[A-Z])/g.test(x)).toBeTruthy()
      expect(x.length).toBe(40)
    })
  })
})
