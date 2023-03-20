function makeCounter() {
    const SpinningChars = '|/-\\'
    let n = 0
    return function() {
        // process.stdout.clearLine();
        // process.stdout.cursorTo(0);
        if(n % 997) process.stdout.write(`\b${SpinningChars[n % 4]}`)
        n++
    }

}

const tick = makeCounter()

for (let i = 0; i < 1e6; i++) {
    tick()
}