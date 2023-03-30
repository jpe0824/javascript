let lastEntry = 9001
let lastPage = 1
if(lastEntry % 100 === 0) lastPage = Math.floor(lastEntry / 100);
else lastPage = Math.floor(lastEntry / 100) + 1;
console.log(lastPage)
// for(let i = 1; i < 100; i++) {
//   console.log(lastEntry % 100)
// }