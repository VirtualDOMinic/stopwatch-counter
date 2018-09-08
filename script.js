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

var mainStartBtn = document.getElementById("main-timer-start-btn");
var mainTimerDisplay = document.getElementById("main-timer-display");

// global intervalID so it can easily be stopped
var intervalID;

if (!window) {
  console.log("no window object! This scripts gonna fail");
} else {
  console.log("woo theres a window!");
}

// Timer "state" object, which is updated to include a key for each presenter, which has another object with presenter data/state 
var timerState = {
  created: false,
  userSelected: undefined,
  timerActive: false,
  timeLeftMS: 0,
};

// first submit
firstForm.addEventListener("submit", eventListenerCB);

function eventListenerCB(event) {

  event.preventDefault();
  console.log("Run: first form event listener");

  // clear old data on subsequent runs
  if(timerState.created){
    console.log("timerState refreshed")
    timerState = {
      created: false,
      userSelected: undefined,
      timerActive: false,
      timeLeftMS: 0,
    }

    // clear top description of people and time per presenter
    noticeArea.textContent = "";

    //remove old eventListener to avoid it being called twice
    stopwatchArea
    .removeEventListener("click", stopwatchAreaListenerCB)

    // stop interval func
    clearInterval(intervalID);

    // reset start button text
    mainStartBtn.textContent = "Start main timer"
  }

  timerState.created = true;

  var peopleInputVal = numberOfPeople.value;
  var timeInputVal = timeInput.value;
  var peoplesNamesArr = namesInput.value.split(", ");

  //   input validation
  if (peopleInputVal.match(/[^0-9]/g) || timeInputVal.match(/[^0-9]/g)) {
    stopwatchArea.textContent = "";
    welcomeMsg.textContent = "Please check your number inputs! Thanks";
    welcomeMsg.classList.add("notice");
  } else if (peoplesNamesArr.length != peopleInputVal) {
    stopwatchArea.textContent = "";
    welcomeMsg.textContent =
      "Please ensure that the number of names that you input matches the number of people presenting";
    welcomeMsg.classList.add("notice");
  } else {
    welcomeMsg.textContent = "";
    timerStatepeople = Number(peopleInputVal);
    timerState.timeLeftMS = Number(timeInputVal) * 60 * 1000;
    console.log(peoplesNamesArr);

    // populate stopwatch area after clearing it
    stopwatchArea.textContent = "";

    createStopwatchArea(peoplesNamesArr.length, timerState.timeLeftMS, peoplesNamesArr);
  }

  timer.scrollIntoView()
}

function timerFunc() {
  // this is the function called every 1000 ms by setInterval
  console.log("timerFunc called");

  if(timerState.timerActive === true){
    updateTimerStateObj();
    updateTimerDisplay();
  }
}

function updateTimerStateObj() {
  // placeholder func to update timerState.timeLeft value, and the specific presenter's time taken
  timerState.timeLeftMS -= 1000;

  if (timerState.userSelected){
    timerState[timerState.userSelected].timeTakenMS += 1000;
  }
}

function updateTimerDisplay() {
  if (timerState.userSelected){
    document.getElementById(timerState.userSelected + "_timer")
    .textContent = 
    convertToMinsSecs(timerState[timerState.userSelected].timeTakenMS);
  }

  if(timerState.timeLeftMS < 0){
    mainTimerDisplay.textContent = "Time up!";
  } else {
    mainTimerDisplay.textContent = convertToMinsSecs(timerState.timeLeftMS);
  }
  console.log("updateTimerDisplay called")
}

// convert ms value into a string of "mm:ss"
function convertToMinsSecs(ms){
  var formattedTime = [Math.floor(ms / 60000)]
  // Add leading "0" to numbers under 10
  formattedTime.push(
    ('0' + ((ms % 60000)/1000))
    .slice(-2)
  )
  return formattedTime.join(":")
}

// main timer event listener function
mainStartBtn.addEventListener("click", function(e) {
  // only create one setInterval. Hacky way to do it but it works fine, and I can't think of any obvious scenarios where this falls down...
  // Easy alterntive is to create the setInterval on load, and never call it
  if(e.target.textContent === "Start main timer"){
    intervalID = window.setInterval(timerFunc, 1000);
  }
  
  //activate timer via timerState object (timerFunc relies on this)
  timerState.timerActive = !timerState.timerActive;

  if(timerState.timerActive === true){
    e.target.textContent = "pause"
  } else {
    e.target.textContent = "resume"
  }

  });

// function to create stopwatch area
// Needs refactoring!
function createStopwatchArea(ppl, time, pplArr) {
  console.log("Run: createStopwatchArea");
  // create "overview" text description
  var areaIntro = document.createElement("p");

  areaIntro.textContent =
    "There are " +
    ppl +
    " people presenting (" +
    pplArr.join(", ") +
    "), and each presenter should aim to present for " +
    convertToMinsSecs(time / ppl);

  timerArea.classList.remove("hidden"); // display main timer
  mainTimerDisplay.textContent = convertToMinsSecs(time);
  areaIntro.classList.add("notice");
  noticeArea.appendChild(areaIntro);

  createTimerObjects(time / ppl, pplArr);
  createPeoplesDivs(ppl);
  // then call a function to add event listener to stopwatch area
  stopwatchAreaListener();
}

stopwatchAreaListener = function() {
  console.log("stopwatchAreaListener");
  stopwatchArea.addEventListener("click", stopwatchAreaListenerCB);
};

function stopwatchAreaListenerCB(x) {
  if (x.target.id.includes("presenter") && !x.target.id.includes("timer")) {
    divSelectionHandler(x.target);
  } else if (x.target.parentElement.id.includes("presenter")){
    // this else if statement is to handle any div children
    divSelectionHandler(x.target.parentElement)
  } 
}

// function to make objects to track peoples' time
function createTimerObjects(timeMS, pplNames) {
  console.log("Run: createTimerObjects");
  pplNum = pplNames.length;
  pplNames.forEach((p, i) => {
    timerState["presenter_" + (i + 1)] = {
      name: p,
      timeAllocMS: timeMS,
      timeTakenMS: 0
    };
  });
}

// function to create divs for each person, eventually displaying time left, time taken and button to start/stop
function createPeoplesDivs(people) {
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
  var presenterTime = document.createElement("span");
  presenterDiv.classList.add("normal");
  presenterDiv.id = "presenter_" + (i + 1);
  presenterName.textContent = timerState["presenter_" + (i + 1)].name;
  timerButton.textContent = "select";
  presenterTime.classList.add("timer");
  presenterTime.id = "presenter_" + (i + 1) + "_timer";
  presenterTime.textContent = "0:00"

  presenterDiv.appendChild(presenterName);
  presenterDiv.appendChild(presenterTime);
  presenterDiv.appendChild(timerButton);
  stopwatchArea.appendChild(presenterDiv);
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

function divSelectionHandler(divClicked) {
  console.log("divSelectionHandler called");
  divClicked.parentElement.childNodes.forEach(function(div) {
    if (div.id === divClicked.id) {
      if (div.id === timerState.userSelected) {
        div.classList.remove("selected");
        div.classList.add("normal");
        div.getElementsByTagName("button")[0].textContent = "select";
        timerState.userSelected = undefined;
      } else {
        div.classList.remove("normal");
        div.classList.add("selected");
        div.getElementsByTagName("button")[0].textContent = "deselect";
        timerState.userSelected = div.id;
      }
    } else {
      div.classList.remove("selected");
      div.classList.add("normal");
      div.getElementsByTagName("button")[0].textContent = "select";
    }
  });
}
