const puppeteer = require("puppeteer")
const fs = require("fs")

const OUTPUT_FILE = "./mcupws.json"
const tick = makeAnimation()
const alphaNumRegex = /^[A-Za-z0-9]/
let pwArr = []

function makeAnimation() {
  const numBars = 50
  return (currPage, totalPages) => {
    const percent = currPage / (totalPages + 1)
    const numFilledBars = Math.floor(percent * numBars)
    const numEmptyBars = numBars - numFilledBars
    const filledBar = "█".repeat(numFilledBars)
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0
    const emptyBar = " ".repeat(emptyBarLength)
    const bar = `[${filledBar}${emptyBar}]`
    process.stdout.write(`\r${bar} Scraping... ${Math.floor(percent * 100)}%`)
  }
}

(async () => {
  let lastEntry = null

  try {
    const data = await fs.promises.readFile(OUTPUT_FILE, "utf-8")
    pwArr = JSON.parse(data)
    let pwArrLen = pwArr.length
    lastEntry = pwArrLen > 0 ? pwArrLen : null
    if (pwArrLen == 9993) {
      console.log(`\n${OUTPUT_FILE} already up to date.`)
      console.log(
        `Delete ${OUTPUT_FILE} and try again if you'd like to overwrite.\n`
      )
      return
    }
    console.log(`\nResuming scraping from entry #: ${lastEntry}\n`)
  } catch (err) {
    process.stdout.write(`\rScraping...`)
  }

  tick(1, 100)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1024 })
  const baseUrl = "https://www.passwordrandom.com/most-popular-passwords"

  let currPage = 1
  if (lastEntry) {
    currPage = Math.floor(lastEntry / 100) + 1
    if (lastEntry % 100 === 0) currPage--
  }

  for (; currPage <= 100; currPage++) {
    tick(currPage, 100)

    await page.goto(`${baseUrl}/page/${currPage}`)
    // Set screen size
    const result = await page.evaluate(() => {
      const rows = document.querySelectorAll("#cntContent_lstMain tr")
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td")
        return Array.from(columns, (column) => column.innerText)
      })
    })

    for (let currPw = 0; currPw <= 100; currPw++) {
      if (result[currPw][0]) {
        if (
          lastEntry === null ||
          Number(result[currPw][0]) > Number(lastEntry)
        ) {
          pwArr.push(result[currPw][1])
        }
      }
    }

    const filteredArr = pwArr.filter(
      (item, index) => alphaNumRegex.test(item) && pwArr.indexOf(item) === index
    )
    await fs.promises.writeFile(
      OUTPUT_FILE,
      JSON.stringify(filteredArr, null, 2),
      "utf-8"
    )
  }

  await browser.close()
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(`Scrape complete, ${OUTPUT_FILE} updated\n`)
})()
