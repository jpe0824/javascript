const api = require('novelcovid');

// you can choose which URL to use, this will not change the behaviour of the API
api.gov().then(console.log)
// api.jhucsse.counties().then(console.log)



// async function scrapeVirus() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1080, height: 1024 });
//   const baseUrl = "https://coronavirus.utah.gov/case-counts/";
//   await page.goto(baseUrl);

//   //   const tableRows = await page.$$eval("table tr", (rows) =>
//   //     rows.map((row) => {
//   //       const cells = Array.from(row.querySelectorAll("td"));
//   //       return cells.map((cell) => cell.innerText);
//   //     })
//   //   );

//   const result = await page.evaluate(() => {
//     return document.querySelectorAll("#DataTables_Table_0")
//   })

// //   const result = await page.evaluate(() => {
// //     const rows = document.querySelectorAll("tbody tr");
// //     return Array.from(rows, (row) => {
// //       const columns = row.querySelectorAll("td");
// //       // return Array.from(columns, (column) => column.innerText);
// //     });
// //   });

//   console.log(result);
//   await browser.close();
// }

// scrapeVirus();
// var covidData = require("covid-usa");

// // latest state level by date
// covidData.countyData(countyData => {
//   console.log(countyData["2023-03-10"]["Utah"].cases);
// });
// // covidData.allCounties("Utah", (counties) => {
// //   console.log(counties);
// // });
// covidData.stateData((stateData) => {
//   console.log(stateData["2023-03-12"]["Utah"].cases);
//   // console.log(stateData["2020-03-20"]["California"].deaths);
//   // console.log(stateData["2020-03-20"]["California"].fid);
//   // console.log(stateData["2020-03-20"]["Massachusetts"]["Middlesex"].cases);
// });

// // list of all states in dataset
// covidData.allStates(states => {
//     ...
// });

// // map of each state to list of counties in dataset
// covidData.countiesByState(countiesByState => {
//     console.log(countiesByState["California"])
// });

// // list of all counties in a state in the dataset
// covidData.allCounties("California", counties => {
//     ...
// });
