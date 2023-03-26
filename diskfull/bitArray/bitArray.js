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
    //TODO return true if x is a positive integer; otherwise false
    //example param values
    //[40] false because it's an array
    //{  } false because it's an object
    //'50' false because it's a string
    //40.5 false because it's float
    //-890 false because it's negative
    //3000 true
    //HINT look at Number methods
    return true
  }


  function bitArray(bitSize) {
    if (!isPosInt(bitSize)) {
      console.error('A bitArray can only be created with a positive integer.')
      process.exit(1) //TODO detect the OS and return the correct status code
      //13 for Windows
      //33 for OsX/Linux
      //HINT https://nodejs.org/api/os.html#os_os_type
      //(No, I don't know why Mac is called 'Darwin'. You can find out and tell me.)
    }


    const byteSize = 2 //TODO calc the correct size in bytes
    const bytes = new Uint8Array(byteSize) //automatically 0 filled //used as closure below
    return {
      set:   i => 3, //TODO write 1 to ith bit in bytes
      clear: i => 4, //TODO write 0 to ith bit in bytes
      get:   i => 5, //TODO read 0 or 1 from ith bit in bytes
      flip:  i => 6, //TODO write 1 to ith bit in bytes if it's 0, and vice versa //aka toggle
    } //HINT set, clear, get, flip can each be done in one line
  }




  function main() { //try it out
    const bits = bitArray(32)


    bits.set(0)
    bits.set(3)
    bits.set(7)
    bits.set(8)
    bits.set(24)
    bits.set(30)
    bits.set(1)


    bits.clear(1)
    bits.clear(3)
    bits.clear(24)
    bits.clear(0)


    bits.flip(3)
    bits.flip(9)
    bits.flip(30)
    bits.flip(2)


    //Do all 32 bits have the value you expected?
    for (let i=0; i<32; i++) {
      console.log(i, bits.get(i))
    }
    //NOTE "trying it out" is not the same as testing--AT ALL. Why not?
    //TODO comment out the print loop
    //TODO add console.assert statements before and after each set, clear, flip statement
    //TODO rename main to test
  }
  main()