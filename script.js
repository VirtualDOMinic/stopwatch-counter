// elements to manipulate/check
var timer = document.getElementById("timer");

var numberOfPresenters = document.getElementsByName("number-of-people")[0];
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

// global intervalID so it can easily be stopped by .clearInterval()
var intervalID;

if (!window) {
  console.log("No window object: this script won't work if you're running it in an environment without a window object.");
}

// Timer "state" object, which is updated to include a key for each presenter, which has another object with presenter data/state
var timerState = {
  created: false,
  presenterSelected: undefined,
  timerActive: false,
  timeLeftMS: 0,
  dateNow: 0
};

// first submit
firstForm.addEventListener("submit", validateInputsAndCreateArea);

function validateInputsAndCreateArea(event) {
  event.preventDefault();

  // clear old data on subsequent runs
  if (timerState.created) {
    timerState = {
      created: false,
      presenterSelected: undefined,
      timerActive: false,
      timeLeftMS: 0,
      dateNow: 0
    };

    // clear top description of people and time per presenter
    noticeArea.textContent = "";

    //remove old eventListener to avoid it being called twice
    stopwatchArea.removeEventListener("click", stopwatchAreaListenerCB);

    // stop interval func
    clearInterval(intervalID);

    // reset start button text
    mainStartBtn.textContent = "Start main timer";
  }

  timerState.created = true;

  var peopleInputVal = numberOfPresenters.value;
  var timeInputVal = timeInput.value;
  var presentersNamesArr = namesInput.value.split(", ");

  // input validation
  if (peopleInputVal.match(/[^0-9]/g) || timeInputVal.match(/[^0-9]/g)) {
    stopwatchArea.textContent = "";
    welcomeMsg.textContent = "Please check your number inputs! Thanks";
    welcomeMsg.classList.add("notice");
  } else if (presentersNamesArr.length != peopleInputVal) {
    stopwatchArea.textContent = "";
    welcomeMsg.textContent =
      "Please ensure that the number of names that you input matches the number of people presenting";
    welcomeMsg.classList.add("notice");
  } else {
    welcomeMsg.textContent = "";
    timerStatepeople = Number(peopleInputVal);
    timerState.timeLeftMS = Number(timeInputVal) * 60 * 1000;

    // populate stopwatch area after clearing it
    stopwatchArea.textContent = "";

    createStopwatchArea(
      presentersNamesArr.length,
      timerState.timeLeftMS,
      presentersNamesArr
    );
  }

  // scroll up to show notice, timer, etc
  document.querySelector(".notice").scrollIntoView();
}

function timerFunc() {
  // this is the function called every X ms by setInterval
  if (timerState.timerActive === true) {
    updateTimerStateObj();
    updateTimerDisplay();
  }
}

function updateTimerStateObj() {
  // placeholder func to update timerState.timeLeft value, and the specific presenter's time taken

  let timePassed;

  timerState.dateNow > 0 ? timePassed = Date.now() - timerState.dateNow : timePassed = 1000;

  timerState.timeLeftMS -= timePassed;

  if (timerState.presenterSelected) {
    timerState[timerState.presenterSelected].timeTakenMS += timePassed;
  }

  timerState.dateNow = Date.now()
}

function updateTimerDisplay() {
  if (timerState.presenterSelected) {
    document.getElementById(
      timerState.presenterSelected + "_timer"
    ).textContent = convertToMinsSecs(
      timerState[timerState.presenterSelected].timeTakenMS
    );
  }

  if (timerState.timeLeftMS < 0) {
    mainTimerDisplay.textContent = "Time up!";
  } else {
    mainTimerDisplay.textContent = convertToMinsSecs(timerState.timeLeftMS);
  }
}

/*
  convert ms value into a string of "mm:ss"
 
  Example:
  > convertToMinsSecs(1000) // => 0:01
 */

function convertToMinsSecs(ms) {
  var formattedTime = [Math.floor(ms / 60000)];
  // Add leading "0" to numbers under 10
  formattedTime.push(("0" + Math.round((ms % 60000) / 1000)).slice(-2));
  return formattedTime.join(":");
}

// main timer event listener function
mainStartBtn.addEventListener("click", mainStartBtnCB);

function mainStartBtnCB(e) {
  // only create one setInterval. Hacky way to do it but it works fine, and I can't think of any obvious scenarios where this falls down...
  // Easy alterntive is to create the setInterval on load, and never call it
  if (e.target.textContent === "Start main timer") {
    intervalID = window.setInterval(timerFunc, 998);
  }

  //activate timer via timerState object (timerFunc relies on this)
  timerState.timerActive = !timerState.timerActive;

  if (timerState.timerActive === true) {
    e.target.textContent = "pause";
  } else {
    e.target.textContent = "resume";
    timerState.dateNow = 0;
  }
}

// function to create stopwatch area
// Needs refactoring!
function createStopwatchArea(numberOfPresenters, time, arrOfPresenters) {
  // create "overview" text description
  var areaIntro = document.createElement("p");

  areaIntro.textContent =
    "There are " +
    numberOfPresenters +
    " people presenting (" +
    arrOfPresenters.join(", ") +
    "), and each presenter should aim to present for " +
    convertToMinsSecs(time / numberOfPresenters);

  timerArea.classList.remove("hidden"); // display main timer
  mainTimerDisplay.textContent = convertToMinsSecs(time);
  areaIntro.classList.add("notice");
  noticeArea.appendChild(areaIntro);

  createTimerObjects(time / numberOfPresenters, arrOfPresenters);

  // Create mini stopwatch divs for each presenter
  for (var i = 0; i < numberOfPresenters; i++) {
    createPresenterStopwatches(i);
  }

  // then call a function to add event listener to stopwatch area
  stopwatchAreaListener();
}

stopwatchAreaListener = function() {
  stopwatchArea.addEventListener("click", stopwatchAreaListenerCB);
};

function stopwatchAreaListenerCB(x) {
  if (x.target.id.includes("presenter") && !x.target.id.includes("timer")) {
    divSelectionHandler(x.target);
  } else if (x.target.parentElement.id.includes("presenter")) {
    // this else if statement is to handle any div children
    divSelectionHandler(x.target.parentElement);
  }
}

// function to make objects to track presenters' time
function createTimerObjects(timeMS, pplNames) {
  pplNum = pplNames.length;
  pplNames.forEach((p, i) => {
    timerState["presenter_" + (i + 1)] = {
      name: p,
      timeAllocMS: timeMS,
      timeTakenMS: 0
    };
  });
}

function createPresenterStopwatches(i) {
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
  presenterTime.textContent = "0:00";

  presenterDiv.appendChild(presenterName);
  presenterDiv.appendChild(presenterTime);
  presenterDiv.appendChild(timerButton);
  stopwatchArea.appendChild(presenterDiv);
}

selectUserForTimer = function(usr) {
  // if user already selected, "deselect" them
  if (timerState.presenterSelected === usr) {
    timerState.presenterSelected = undefined;
  } else {
    timerState.presenterSelected = usr;
  }
};

// Rename to "person..."?
function divSelectionHandler(divClicked) {
  divClicked.parentElement.childNodes.forEach(function(div) {
    if (div.id === divClicked.id) {
      if (div.id === timerState.presenterSelected) {
        div.classList.remove("selected");
        div.classList.add("normal");
        div.getElementsByTagName("button")[0].textContent = "select";
        timerState.presenterSelected = undefined;
      } else {
        div.classList.remove("normal");
        div.classList.add("selected");
        div.getElementsByTagName("button")[0].textContent = "deselect";
        timerState.presenterSelected = div.id;
      }
    } else {
      div.classList.remove("selected");
      div.classList.add("normal");
      div.getElementsByTagName("button")[0].textContent = "select";
    }
  });
}

// keyboard control - assuming up to 9 presenters
var numStrArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

document.addEventListener("keydown", function(e) {
  if (
    numStrArr.includes(e.key) &&
    !e.key.ctrlKey &&
    e.srcElement.nodeName.toLowerCase() !== "input"
  ) {
    var presenterToSelect = "presenter_" + e.key;
    if (document.getElementById(presenterToSelect)) {
      divSelectionHandler(document.getElementById(presenterToSelect));
    }
  } else if (
    e.key === " " &&
    e.srcElement.nodeName.toLowerCase() === "body" &&
    !timer.classList.contains("hidden")
  ) {
    // stop space bar from scrolling page
    e.preventDefault();
    // simulate click instead of calling mainStartBtnCB because the event needs to be passed in
    mainStartBtn.click();
  }
});
