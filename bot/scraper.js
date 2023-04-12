const puppeteer = require("puppeteer");

async function scrapeVirus() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  const baseUrl = "https://coronavirus.utah.gov/case-counts/";
  await page.goto(baseUrl);

  //   const tableRows = await page.$$eval("table tr", (rows) =>
  //     rows.map((row) => {
  //       const cells = Array.from(row.querySelectorAll("td"));
  //       return cells.map((cell) => cell.innerText);
  //     })
  //   );

  const result = await page.evaluate(() => {
    return document.querySelectorAll("#DataTables_Table_0")
  })

//   const result = await page.evaluate(() => {
//     const rows = document.querySelectorAll("tbody tr");
//     return Array.from(rows, (row) => {
//       const columns = row.querySelectorAll("td");
//       // return Array.from(columns, (column) => column.innerText);
//     });
//   });

  console.log(result);
  await browser.close();
}

scrapeVirus();
