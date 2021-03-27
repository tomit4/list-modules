const writeList = require('./writelist.js');
const prompt = require('prompt-sync')();
const fs = require('fs');
let finishedArrString = writeList.finishedArrString;
let finishedArr = writeList.finishedArr;

const currentDate = new Date();
let currentHour = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();
let currentTime = getTime(currentHour);

function getTime (now) {
	if (now > 12) {
		now = 12;
		if (now < 1) {
			now = '12';
			}
		if (now < 10 && now > 0) {
			now = '0' + now;
		}
		if (currentMinutes < 10) {
			currentMinutes = '0' + currentMinutes;
		}
		return now +':' + currentMinutes + 'PM';
	} if (now < 1) {
		now = '12';
	}
	    if (now < 10) {
			now = '0' + now;
		}
		if (currentMinutes < 10 && currentMinutes !== '00') {
			currentMinutes = '0' + currentMinutes;
		}
		return now + ':' + currentMinutes + 'AM';
}

function alertMe (arr, time) {
	for (let i in arr) {
		if (arr[i].charAt(arr[i].length - 7) == time.charAt(0) && 
		arr[i].charAt(arr[i].length - 6) == time.charAt(1) && 
		arr[i].charAt(arr[i].length -2) == time.charAt(5)) {
		console.log("This Hour's Tasks: " + arr[i]);
		}
	}
}

console.log(finishedArrString);
alertMe(finishedArr, currentTime);
console.log('The Current Time is: ' + currentTime);

(function writeIt() {
	let writePrompt = prompt('Would you like to save your list?: ');
	if (writePrompt == 'y' || writePrompt == 'yes' || writePrompt == 'Yes') {
		let fileName = prompt('What would you like to name your file?: ');
		fs.writeFile(fileName + '.txt', finishedArrString, () => {
			console.log(fileName + '.txt was saved.');
		});
	}else {
		console.log('List not saved.');
	}
})();