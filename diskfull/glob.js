const {
    globSync,
    globIterateSync
} = require('glob')
const label = 'root globbing'

for (const file of globIterateSync('./**/*')) {
    console.log(file)
}
// console.time(label)
// for (const file of g2) {
//     console.timeEnd(label)
//     console.log(file)
//     break
// }

// let files = glob.GlobSync('/**/*.js')

// console.log(files)