const bcrypt = require('bcryptjs')
const fs = require('fs')
const _ = require('lodash')

const alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const salt = 4

function getRandChars(numChars) {
  let i = 0
  let word = ''
  while (i < numChars) {
    const index = _.random(61)
    word += alphaNum[index]
    i++
  }
  return word
}

function main() {
  console.time(`with salt value of ${salt}`)
  const words = require('./mcupws.json')

  const randomPasswords = new Array(1000).fill('').map(() => {
    const index = _.random(words.length)
    return words[index]
  })

  const hashedPasswords = randomPasswords.map((password) =>
    bcrypt.hashSync(password, salt)
  )

  const emptyHashes = new Array(500).fill('').map(() => bcrypt.hashSync('', 4))

  const oneCharHashes = new Array(390).fill('').map(() => {
    const randChar = getRandChars(1)
    return bcrypt.hashSync(randChar, salt)
  })

  const twoCharHashes = new Array(100).fill('').map(() => {
    const randChars = getRandChars(2)
    return bcrypt.hashSync(randChars, salt)
  })

  const threeCharHashes = new Array(10).fill('').map(() => {
    const randChars = getRandChars(3)
    return bcrypt.hashSync(randChars, salt)
  })

  const allHashes = hashedPasswords.concat(
    emptyHashes,
    oneCharHashes,
    twoCharHashes,
    threeCharHashes
  )
  const shuffledHashes = _.shuffle(allHashes)

  fs.writeFile('2K.hashes.txt', shuffledHashes.join('\n'), (err) => {
    if (err) throw err
    console.log('Hashes saved to 2K.hashes.txt')
  })
  console.timeEnd(`with salt value of ${salt}`)
}

main()
