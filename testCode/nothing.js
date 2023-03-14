function getAndIncrementLastNumber(str) {
    return str.replace(/\d+$/, function(s) {
        return ++s;
    });
}
let id = "6400ff8b6e5f3ae763022552"
let date = "3/2/2023, 2:02:36 PM"
let message = "did todo's for project"

let newId = getAndIncrementLastNumber(id);
console.log(newId)

const now = new Date();
const month = (now.getMonth() + 1).toString().padStart(1, '0');
const day = now.getDate().toString().padStart(1, '0');
const year = now.getFullYear();
const hours = now.getHours();
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');
const amOrPm = hours >= 12 ? 'PM' : 'AM';
const formattedDate = `${month}/${day}/${year}, ${hours % 12}:${minutes}:${seconds} ${amOrPm}`;

// console.log(formattedDate);

let newDate = Date.now();

// console.log(newDate÷
function getRandomHexString() {
    const now = Date.now();
    const randomValue = Math.floor(Math.random() * now);
    console.log(randomValue.toString(16));
}

getRandomHexString()