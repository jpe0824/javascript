const puppeteer = require('puppeteer');
const fs = require('fs');

const OUTPUT_FILE = './mcupws.json';
const tick = makeAnimation();
const alphaNumRegex = /^[A-Za-z0-9]/;

function makeAnimation() {
    let chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉'];
    let n = 0;
    return () => {
        process.stdout.write(`\r${chars[n % chars.length]} Scrape in progress...`);
        n++;
    };
}

(async () => {
    let pwDict = {};
    let lastEntry = null;

    try {
        const data = await fs.promises.readFile(OUTPUT_FILE, 'utf-8');
        pwDict = JSON.parse(data);
        const entries = Object.keys(pwDict);
        lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
        if (lastEntry == 10000) {
            console.log(`${OUTPUT_FILE} already up to date`)
            return
        }
        console.log(`Resuming scraping from entry #: ${lastEntry}`);
    } catch (err) {
        console.log(`Writing file from start`);
    }

    tick();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const baseUrl = 'https://www.passwordrandom.com/most-popular-passwords';

    let currPage = 1;
    if (lastEntry) {
        currPage = Math.floor(lastEntry / 100) + 1;
        if (lastEntry % 100 === 0) currPage--
    }

    for (; currPage <= 100; currPage++) {
        tick();
        await page.goto(`${baseUrl}/page/${currPage}`);
        tick();
        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });
        tick();
        const result = await page.evaluate(() => {
            const rows = document.querySelectorAll('#cntContent_lstMain tr');
            return Array.from(rows, (row) => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, (column) => column.innerText);
            });
        });

        for (let pw of result) {
            tick();
            if (pw[0]) {
                let pwData = {};
                if (alphaNumRegex.test(pw[1])) {
                    pwData = {
                        password: pw[1],
                        md5: pw[2],
                        length: pw[3],
                        lowerCount: pw[4],
                        upperCount: pw[5],
                        numCount: pw[6],
                    };
                }
                if ((lastEntry === null) || (Number(pw[0]) > Number(lastEntry))) {
                    pwDict[pw[0]] = pwData;
                    await fs.promises.writeFile(
                        OUTPUT_FILE,
                        JSON.stringify(pwDict, null, 2),
                        'utf-8'
                    );
                }
            }
        }
    }

    await browser.close();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`Scrape complete, data exported to file: ${OUTPUT_FILE}`);
})();