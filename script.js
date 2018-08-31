// elements to manipulate/check
var timer = document.getElementById("timer");

var numberOfPeople = document.getElementsByName("number-of-people")[0];
var timeInput = document.getElementsByName("time-minutes")[0];
var namesInput = document.getElementsByName("names")[0];

var submit = document.getElementById("submit-btn-1");
var firstForm = document.getElementById("first-form");
var welcomeMsg = document.getElementById("welcome-msg");
var welcome = document.getElementById("welcome");

var stopwatchArea = document.getElementById("stopwatch-area");
var noticeArea = document.getElementById("notice-area");
var timerArea = document.getElementById("timer");

// current user selected. May make this part of a window.object instead
// var userSelected = "";

// Note to self...
if (!window) {
  console.log("no window object! This scripts gonna fail");
} else {
  console.log("woo theres a window!");
}

// Having a go at making timer object. Maybe add `people` and `startTime` vars here
timerState = {
  userSelected: undefined,
  timerActive: false,
  timeLeft: 0
};

// might not need these as globals
var people = 0;
var startTime = 0; //minutes

// first submit
firstForm.addEventListener("submit", function(event) {
  event.preventDefault();
  console.log("Run: first form event listener");
  var peopleInputVal = numberOfPeople.value;
  var timeInputVal = timeInput.value;
  var peoplesNamesArr = namesInput.value.split(", ");

  //   input validation
  if (peopleInputVal.match(/[^0-9]/g) || timeInputVal.match(/[^0-9]/g)) {
    stopwatchArea.innerText = "";
    welcomeMsg.innerText = "Please check your number inputs! Thanks";
    welcomeMsg.classList.add("notice");
  } else if (peoplesNamesArr.length != peopleInputVal) {
    stopwatchArea.innerText = "";
    welcomeMsg.innerText =
      "Please ensure that the number of names that you input matches the number of people presenting";
    welcomeMsg.classList.add("notice");
  } else {
    welcomeMsg.innerText = "";
    people = Number(peopleInputVal);
    startTime = Number(timeInputVal);
    console.log(peoplesNamesArr);

    // future plan: run function to clear window contents and add options to put names of people. Cleaner. See for loop in createSecontForm function that I commented out

    // populate stopwatch area
    stopwatchArea.innerText = "";

    createStopwatchArea(people, startTime, peoplesNamesArr);
  }
});

// function to create stopwatch area
function createStopwatchArea(ppl, time, pplArr) {
  console.log("Run: createStopwatchArea");
  // create "overview" text description
  var areaIntro = document.createElement("p");

  var minsPerPerson = (time / ppl).toPrecision(2);

  areaIntro.textContent =
    "There are " +
    ppl +
    " people (" +
    pplArr.join(", ") +
    "), and each person should aim to present for " +
    minsPerPerson +
    " minutes";

  timerArea.classList.remove("hidden"); // display main timer
  areaIntro.classList.add("notice");
  noticeArea.appendChild(areaIntro);

  createTimerObjects(minsPerPerson, pplArr);
  createPeoplesDivs();
}

// function to make objects to track peoples' time
function createTimerObjects(mins, pplNames) {
  console.log("Run: createTimerObjects");
  pplNames.forEach((p, i) => {
    timerState["presenter_" + i] = {
      name: p,
      timeAllocMS: mins * 60000,
      timeTakenMS: 0
    };
  });
}

// function to create divs for each person, eventually displaying time left, time taken and button to start/stop
function createPeoplesDivs() {
  console.log("Run: createPeopleDivs");
  // could use forEach here but not sure about browser support
  for (var i = 0; i < people; i++) {
    createPeopleTest(i);
  }
}

function createPeopleTest(i) {
  console.log("Run: createPeopleTest");
  var presenterDiv = document.createElement("div");
  var timerButton = document.createElement("button");
  var presenterName = document.createElement("h3");
  presenterDiv.classList.add("test-div");
  presenterDiv.id = "presenter_" + i;
  presenterName.innerText = timerState["presenter_" + i].name;
  timerButton.innerText = "select";
  timerButton.onclick = function(e) {
    var userSel = e.target.parentElement.id;
    updateButtonText(userSel, timerState.userSelected);
    selectUserForTimer(userSel);
  };
  presenterDiv.appendChild(presenterName);
  presenterDiv.appendChild(timerButton);
  stopwatchArea.appendChild(presenterDiv);

  console.log("finished createPeopleTest");
}

selectUserForTimer = function(usr) {
  console.log("Run: selectUserForTimer");
  // if user already selected, "deselect" them
  if (timerState.userSelected === usr) {
    timerState.userSelected = undefined;
  } else {
    timerState.userSelected = usr;
  }
};

basicTimer = function() {
  console.log("Run: basicTimer");
  var timerSched = window.setInterval(timerCB, 1000);
  console.log(timerSched, "timersched ID");
};

var dateNow = Date.now();

timerCB = function() {
  console.log("Run: timerCB");
  var timeTest = 795000;
  // 13 mins 15 seconds
  formatTime(timeTest);
};

formatTime = function(ms) {
  console.log("Run: formatTime");
  var mins = 0;
  var secs = 0;
  mins += ms / 60000;
  secs += (ms % 60000) / 1000;
  console.log(Math.floor(mins) + "m:" + secs + "s");
};

updateButtonText = function(selected, prevSelected) {
  // e.g. selected = "person_2", prevSelected = "person_0"
  console.log("Run: updateButtonText");
  document
    .getElementById(selected)
    .getElementsByTagName("button")[0].innerText = "deselect";
  if (
    prevSelected !== undefined &&
    (selected !== prevSelected ||
      document.getElementById(selected).getElementsByTagName("button")[0]
        .innerText === "deselect")
  ) {
    document
      .getElementById(prevSelected)
      .getElementsByTagName("button")[0].innerText = "select";
  }
};

//
//
//
//
//
//
//
//
//
// Future plans...

// on form reset, check put the last used vals for number of people, total time, and names into form inputs
// edit: ^ this may not be necessary!

/* 
function createSecondForm(ppl, time) {

    welcome.innerText = "";

    // welcome.innerText = "There are " + ppl + " people, and each person has " + (time / ppl).toPrecision(2) + " minutes to present";

    //create final inputs
    for (var i = 0; i < people; i++) {
        console.log("hi");
    }

}

*/
