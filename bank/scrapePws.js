const puppeteer = require('puppeteer');
const fs = require('fs');

const OUTPUT_FILE = './mcupws.json'
const tick = makeAnimation()
const alphaNumRegex = /^[A-Za-z0-9]/

function makeAnimation() {
    let chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉']
    let n = 0
    return () => {
        process.stdout.write(`\r${chars[n % chars.length]} Scrape in progress...`)
        n++
    }
}

(async () => {
    tick()
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const baseUrl = 'https://www.passwordrandom.com/most-popular-passwords'
    const pwDict = { }

    for(let i = 1; i <= 100; i++) {
        tick()
        await page.goto(`${baseUrl}/page/${i}`);
        tick()
        // Set screen size
        await page.setViewport({width: 1080, height: 1024});
        tick()
        const result = await page.evaluate(() => {
            const rows = document.querySelectorAll('#cntContent_lstMain tr');
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.innerText);
            });
        });

        for (let pw of result) {
            tick()
            if(pw[0]) {
                let pwData = { }
                if(alphaNumRegex.test(pw[1])) {
                    pwData[pw[0]] = {
                        "password": pw[1],
                        "md5": pw[2],
                        "length": pw[3],
                        "lowerCount": pw[4],
                        "upperCount": pw[5],
                        "numCount": pw[6],
                    };
                    pwDict[pw[0]] = pwData[pw[0]];
                }
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pwDict, null, 2) , 'utf-8');
    }

    await browser.close();
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(`Scrape complete, data exported to file: ${OUTPUT_FILE}`)
  })();