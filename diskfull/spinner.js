function makeAnimation() {
    let chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"]
    let n = 0
    return () => {
        if(n % 2131) process.stdout.write(`\r${chars[n % chars.length]} Loading...`)
        n++
    }
}

const tick = makeCounter()

for (let i = 0; i < 1e6; i++) {
    tick()
}