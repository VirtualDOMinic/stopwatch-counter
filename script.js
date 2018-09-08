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

var mainStartBtn = document.getElementById("main-timer-start");

if (!window) {
  console.log("no window object! This scripts gonna fail");
} else {
  console.log("woo theres a window!");
}

// Timer "state" object, which is updated to include a key for each presenter, which has another object with presenter data/state 
timerState = {
  userSelected: undefined,
  timerActive: false,
  timeLeftMS: 0,
};

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
    timerStatepeople = Number(peopleInputVal);
    timerState.timeLeftMS = Number(timeInputVal) * 60 * 1000;
    console.log(peoplesNamesArr);

    // future plan: run function to clear window contents and add options to put names of people. Cleaner. See for loop in createSecontForm function that I commented out

    // populate stopwatch area
    stopwatchArea.innerText = "";

    createStopwatchArea(peoplesNamesArr.length, timerState.timeLeftMS, peoplesNamesArr);
  }
});

function timerFunc() {
  // placeholder func. Need to add functionality (will call timer display DOM functions and update timer object)
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
    document.getElementById(timerState.userSelected)
    .innerText = 
    convertToMinsSecs(timerState[timerState.userSelected].timeTakenMS);
  }

  document.getElementById("main-time-display")
  .innerText = convertToMinsSecs(timerState.timeLeftMS);

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
  if(e.target.innerText === "Start main timer"){
    var intervalID = window.setInterval(timerFunc, 1000);
  }
  
  //activate timer via timerState object (timerFunc relies on this)
  timerState.timerActive = !timerState.timerActive;

  if(timerState.timerActive === true){
    e.target.innerText = "pause"
  } else {
    e.target.innerText = "resume"
  }

  });

// function to create stopwatch area
// Needs refactoring!
function createStopwatchArea(ppl, time, pplArr) {
  console.log("Run: createStopwatchArea");
  // create "overview" text description
  var areaIntro = document.createElement("p");

  // parseFloat is to avoid using scientific/exp (e) notation
  var minsPerPerson = parseFloat((time / ppl).toPrecision(2));

  areaIntro.textContent =
    "There are " +
    ppl +
    " people (" +
    pplArr.join(", ") +
    "), and each person should aim to present for " +
    (minsPerPerson / 60000).toPrecision(2) +
    " minutes";

  timerArea.classList.remove("hidden"); // display main timer
  areaIntro.classList.add("notice");
  noticeArea.appendChild(areaIntro);

  createTimerObjects(minsPerPerson, pplArr);
  createPeoplesDivs(ppl);
  // then call a function to add event listener to stopwatch area
  stopwatchAreaListener();
}

stopwatchAreaListener = function() {
  console.log("stopwatchAreaListener");
  document
    .getElementById("stopwatch-area")
    .addEventListener("click", function(x) {
      if (x.target.id.includes("presenter")) {
        drySelector(x.target);
      } else if (x.target.nodeName.toLowerCase() === "button") {
        console.log("button clicked!");
        if (x.target.innerText === "select") {
          x.target.innerText = "deselect";
        } else {
          x.target.innerText = "select";
        }

        if (x.target.innerText === "deselect") {
          console.log("deselect initiated");
        }

        x.target.parentElement.parentElement.childNodes.forEach(function(y) {
          if (x.target.parentElement.id !== y.id) {
            y.classList.remove("selected");
            y.classList.add("normal");
          } else if (x.target.parentElement.id === y.id) {
            y.classList.remove("normal");
            y.classList.add("selected");
            selectUserForTimer(y.id);
          }
        });
      } else if (x.target.parentElement.id.includes("presenter")){
        // this else if statement is to handle any div children that aren't the button
        drySelector(x.target.parentElement)
      } 
      
    });
};

// function to make objects to track peoples' time
function createTimerObjects(timeMS, pplNames) {
  console.log("Run: createTimerObjects");
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
  presenterDiv.classList.add("test-div");
  presenterDiv.classList.add("normal");
  presenterDiv.id = "presenter_" + (i + 1);
  presenterName.innerText = timerState["presenter_" + (i + 1)].name;
  timerButton.innerText = "select";

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


// Future plans...

// on form reset, check put the last used vals for number of people, total time, and names into form inputs
// edit: ^ this may not be necessary!


// CODE IS (WAS?) WAY TOO WET! Below, I'm making a function to update the div style, button text and userSelected, with input being the presenter div that has been clicked:

function drySelector(divClicked) {
  console.log("drySelector called");
  divClicked.parentElement.childNodes.forEach(function(div) {
    if (div.id === divClicked.id) {
      if (div.id === timerState.userSelected) {
        div.classList.remove("selected");
        div.classList.add("normal");
        div.getElementsByTagName("button")[0].innerText = "select";
        timerState.userSelected = undefined;
      } else {
        div.classList.remove("normal");
        div.classList.add("selected");
        div.getElementsByTagName("button")[0].innerText = "deselect";
        timerState.userSelected = div.id;
      }
    } else {
      div.classList.remove("selected");
      div.classList.add("normal");
      div.getElementsByTagName("button")[0].innerText = "select";
    }
  });
}
