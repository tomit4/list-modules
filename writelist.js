const readList = require('./readlist.js');
const prompt = require('prompt-sync')();

let currentRoutineAM = readList.currentRoutineAM,
    currentRoutinePM = readList.currentRoutinePM,
    newRoutineItem = readList.newRoutineItem,
    twelvesArrAM = readList.twelvesArrAM,
    twelvesArrPM = readList.twelvesArrPM,
    finishedAMArr = readList.finishedAMArr,
    finishedPMArr = readList.finishedPMArr,
    finishedArr = readList.finishedArr,
    finishedArrString = readList.finishedArrString; //after seeing how destructuring works, I can see that this would be a good place to do so.

console.log(finishedArrString);

function getUserInput () {
    let TASK = prompt('What would you like to do?: ');
    let HOUR = Number(prompt('At what Hour?(double digits): '));
    let MIN = Number(prompt('And Minutes?(double digits): '));
    let AMPM = prompt('AM or PM?: ').toUpperCase();
if (AMPM == 'AM') {
    currentRoutineAM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
}
if (AMPM == 'PM') {
    currentRoutinePM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
}
}

function firstPrompt () {
let makeItem = prompt('Would you like to add to your List?: ');
if (makeItem == 'y' || makeItem == 'yes' || makeItem == 'Yes' || makeItem == 'sure') {
    getUserInput();
} else if (makeItem == 'n' || makeItem == 'no' || makeItem == 'No' || makeItem == 'nah') {
    console.log('Compiling List ...')
} else {
    console.error('Please answer yes or no.');
    firstPrompt();
}
}

firstPrompt();

(function makeAnother() {
let again = prompt('Add another Item to your To Do List?: ')
if (again == 'y' || again == 'yes' || again == 'Yes' || again == 'sure') {
    getUserInput();
    makeAnother();
} else if (again == 'n' || again == 'no' || again == 'No' || again == 'sure') {
    console.log('Compiling List ...');
} else {
    console.error('Please answer yes or no');
    makeAnother();
}
})();


currentRoutineAM = currentRoutineAM.sort((a, b) => a.MIN - b.MIN);
currentRoutineAM = currentRoutineAM.sort((a, b) => a.HR - b.HR);

currentRoutinePM = currentRoutinePM.sort((a, b) => a.MIN - b.MIN);
currentRoutinePM = currentRoutinePM.sort((a, b) => a.HR - b.HR);

twelvesArrAM = [];
twelvesArrPM = [];

function twelveFirst(arr) { //certain functions I couldn't figure out why I couldn't simply import them, such as this one,
//for whatever reason it would call the function, but not push it to the twelvesArr arrays.
	for (let i = arr.length - 1; i >= 0; i--) {
	  if (arr[i].HR == '12' && arr[i].AMPM == 'AM') {
		twelvesArrAM.push(arr[i]);
		arr.pop();
		}
		else if (arr[i].HR == '12' && arr[i].AMPM == 'PM') {
			twelvesArrPM.push(arr[i]);
			arr.pop();
		}
	}
}


twelveFirst(currentRoutineAM);
twelveFirst(currentRoutinePM);

twelvesArrAM = twelvesArrAM.sort((a,b) => a.MIN - b.MIN);
twelvesArrPM = twelvesArrPM.sort((a,b) => a.MIN - b.MIN);

currentRoutineAM = twelvesArrAM.concat(currentRoutineAM);
currentRoutinePM = twelvesArrPM.concat(currentRoutinePM);


finishedAMArr = [];
finishedPMArr = [];

function prettier (arr) { //similar issue to the twelveFirst function, couldn't import it and
//have it work at the same time..
	for (let i in arr) {
		arr[i].HR = arr[i].HR.toString(); 
		if (arr[i].HR.length == 1) {
			arr[i].HR = '0' + arr[i].HR;
		}
		if (arr[i].HR == '00') { 
			arr[i].HR = '12';
		}
		arr[i].MIN = arr[i].MIN.toString();
		if (arr[i].MIN.length == 1) { 
			arr[i].MIN = '0' + `${arr[i].MIN}`;
		}
		if (arr[i].AMPM == 'AM'){
			finishedAMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
		if (arr[i].AMPM == 'PM') {
			finishedPMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
	}
}

prettier(currentRoutineAM);
prettier(currentRoutinePM);

finishedArr = 
finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

finishedArrString= finishedArr.join('\n');

console.log(finishedArrString);

function removeIt(arr, arr2, removeFunc) {
	let removePrompt = prompt('Remove an Item from your List?: ');
	if (removePrompt == 'Y' || 
		removePrompt == 'y' || 
		removePrompt == 'yes' || 
		removePrompt == 'YES') {
				removeFunc(arr, arr2);
				removeAnother();
	} else {
		console.log('Compiling List ...');
	}
}

function removeItems(arr, arr2) {
	let whichOne = prompt('What Item?: ');
				let isAMPM = prompt('AM or PM?: ');
				for (let i in arr) {
					if (arr[i].TASK == whichOne && 
						arr[i].AMPM == isAMPM) {
					arr.splice(i, 1);
				}
				for (let i in arr2) {
					if (arr2[i].TASK == whichOne && 
						arr2[i].AMPM == isAMPM) {
					arr2.splice(i, 1);
				}
			}
		}
	}

removeIt(currentRoutineAM, currentRoutinePM, removeItems);

function removeAnother() {
	let again = prompt('Remove another Item from your To Do List?: ')
	if (again == 'y' || again == 'yes' || again == 'Yes' || again == 'sure') {
		removeItems(currentRoutineAM, currentRoutinePM);
		removeAnother();
	} else if (again == 'n' || again == 'no' || again == 'No' || again == 'sure') {
		console.log('Compiling List ...');
	} else {
		console.error('Please answer yes or no');
		removeAnother();
	}
}

finishedAMArr = [];
finishedPMArr = [];

prettier(currentRoutineAM);
prettier(currentRoutinePM);

finishedArr = 
finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

finishedArrString= finishedArr.join('\n');

module.exports = {finishedArr, finishedArrString};