const os = require('os')

const bitMask = [
    0b00000001,
    0b00000010,
    0b00000100,
    0b00001000,
    0b00010000,
    0b00100000,
    0b01000000,
    0b10000000
]

function isPosInt(x) {
    return Number.isInteger(x) && x > 0
}

function bitArray(bitSize) {
    if (!isPosInt(bitSize)) {
        console.error('A bitArray can only be created with a positive integer.')
        const osType = os.type()
        if (osType === 'Darwin' || osType === 'Linux') process.exit(33)
        else if (osType === 'Windows_NT') process.exit(13)
        else process.exit(1)
    }

    const byteSize = Math.ceil(bitSize / 8)
    const bytes = new Uint8Array(byteSize) // automatically 0 filled

    return {
        set: i => bytes[Math.floor(i / 8)] |= bitMask[i % 8],
        clear: i => bytes[Math.floor(i / 8)] &= ~bitMask[i % 8],
        get: i => (bytes[Math.floor(i / 8)] & bitMask[i % 8]) ? 1 : 0,
        flip: i => bytes[Math.floor(i / 8)] ^= bitMask[i % 8]
    }
}

function test() {
    const bits = bitArray(32)

    bits.set(0)
    console.assert(bits.get(0) === 1, 'set 0 failed')

    bits.set(3)
    console.assert(bits.get(3) === 1, 'set 3 failed')

    bits.set(7)
    console.assert(bits.get(7) === 1, 'set 7 failed')

    bits.set(8)
    console.assert(bits.get(8) === 1, 'set 8 failed')

    bits.set(24)
    console.assert(bits.get(24) === 1, 'set 24 failed')

    bits.set(30)
    console.assert(bits.get(30) === 1, 'set 30 failed')

    bits.set(1)
    console.assert(bits.get(1) === 1, 'set 1 failed')

    bits.clear(1)
    console.assert(bits.get(1) === 0, 'clear 1 failed')

    bits.clear(3)
    console.assert(bits.get(3) === 0, 'clear 3 failed')

    bits.clear(24)
    console.assert(bits.get(24) === 0, 'clear 24 failed')

    bits.clear(0)
    console.assert(bits.get(0) === 0, 'clear 0 failed')

    bits.flip(3)
    console.assert(bits.get(3) === 1, 'flip 3 failed')

    bits.flip(9)
    console.assert(bits.get(9) === 1, 'flip 9 failed')

    bits.flip(30)
    console.assert(bits.get(30) === 0, 'flip 30 failed')

    bits.flip(2)
    console.assert(bits.get(2) === 1, 'flip 2 failed')

}

module.exports = bitArray

// test()

//ELEPHANT GRAVEYARD

// console.assert(bits.get(0) === 0, 'get 0 failed')
// console.assert(bits.get(1) === 0, 'get 1 failed')
// console.assert(bits.get(2) === 0, 'get 2 failed')
// console.assert(bits.get(3) === 0, 'get 3 failed')
// console.assert(bits.get(7) === 0, 'get 7 failed')
// console.assert(bits.get(8) === 0, 'get 8 failed')
// console.assert(bits.get(24) === 0, 'get 24 failed')
// console.assert(bits.get(30) === 0, 'get 30 failed')

// Do all 32 bits have the value you expected?
// for (let i = 0; i < 32; i++) {
//     console.log(i, bits.get(i))
// }
//NOTE 'trying it out' is not the same as testing--AT ALL. Why not?
//TODO comment out the print loop
//TODO add console.assert statements before and after each set, clear, flip statement
//TODO rename main to test