const prompt = require('prompt-sync')();
const fs = require('fs');
let currentRoutineAM = [];
let currentRoutinePM = [];

function newRoutineItem(TASK, HR, MIN, AMPM) {
	let newObj = new Object();
	newObj.TASK =TASK;
	newObj.HR = HR;
	newObj.MIN = MIN;
	newObj.AMPM = AMPM;
	return newObj;
}

let fileSplit = readFile().split('\n');

function readFile() {
	let wantFile = prompt('Would you like to import your List file?: ');
	if (wantFile == 'y' || wantFile == 'yes' || wantFile == 'Yes') {
		let fileRead = prompt("What's the name of your List file?: ");
		let readIt = fs.readFileSync(fileRead + '.txt', 'utf8');
		return readIt;
	} else {
		console.log('No List file imported');
		let fileSplit = '';
		//firstPrompt();
		return fileSplit;
	}
}

(function removeAMPMLines(arr) {
	for (let i in arr) {
		if (arr[i].includes('at') == false) {
			arr.splice(arr.indexOf(arr[i]), 1);
		}
	}
})(fileSplit);

const splitArrWords = [];
const splitArrNums = [];

(function splitEm (arr, arr2, arr3) {
	for (let i = 0; i < arr.length; i++) {
		arr2.push(arr[i].match(/[\w][\S]*/g));
		arr3.push(arr[i].match(/\d/g))
	}
})(fileSplit, splitArrWords, splitArrNums);

const splitArrAMPM = [];

(function getAMPM (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j].match(/[AP]M/)) {
				arr2.push(arr[i][j].charAt(arr[i][j].length -2).concat
				(arr[i][j].charAt(arr[i][j].length - 1)));
				arr[i].splice(arr[i].indexOf(arr[i][j]));
			}
		}arr[i] = (arr[i].join(' '));
	}
})(splitArrWords, splitArrAMPM);

(function removeAt (arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].slice(0, -3);
	}
})(splitArrWords);

const doubleNums = [];

(function doubleUp (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j+1] !== undefined) {
			arr2.push(arr[i][j].concat(arr[i][j+1]));
			arr[i].splice(arr[i][j], 1);
			}
		}
	}
})(splitArrNums, doubleNums);

const mins = [];

(function getMins (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		if (i !== 0 && i % 2 !== 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, mins);

const hrs = [];

(function getHrs (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		if (i == 0 || i % 2 == 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, hrs);

(function fileInput(arr, arr2, arr3, arr4) {
	for (i in arr) {
		let TASK = arr[i];
		let HOUR = arr2[i];
		let MIN =  arr3[i];
		let AMPM  = arr4[i];
		if (AMPM == 'AM') {
		currentRoutineAM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
		}
		if (AMPM == 'PM') {
		currentRoutinePM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
		}
	}
})(splitArrWords, hrs, mins, splitArrAMPM);

currentRoutineAM = currentRoutineAM.sort((a, b) => a.MIN - b.MIN);
currentRoutineAM = currentRoutineAM.sort((a, b) => a.HR - b.HR);

currentRoutinePM = currentRoutinePM.sort((a, b) => a.MIN - b.MIN);
currentRoutinePM = currentRoutinePM.sort((a, b) => a.HR - b.HR);

let twelvesArrAM = [];
let twelvesArrPM = [];

function twelveFirst(arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
	  if (arr[i].HR == '12' && arr[i].AMPM == 'AM') {
		twelvesArrAM.push(arr[i]);
		arr.pop();
		
		}
		if (arr[i].HR == '12' && arr[i].AMPM == 'PM') {
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

let finishedAMArr = [];
let finishedPMArr = [];

function prettier (arr) {
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

let finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

let finishedArrString= finishedArr.join('\n');

module.exports = {newRoutineItem, currentRoutineAM, currentRoutinePM, twelvesArrAM, 
twelvesArrPM, finishedAMArr, finishedPMArr, finishedArr, finishedArrString};