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

// current user selected. May make this part of a window.object instead
// var userSelected = "";

// Note to self...
if (!window) {
  console.log("no window object! This scripts gonna fail");
} else {
  console.log("woo theres a window!");
}

// Having a go at making timer object. Maybe add `people` var here
timerState = {
  userSelected: undefined,
  timerActive: false,
  timeLeftMS: 0
};

// might not need these as globals
var people = 0;

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
    timerState.timeLeftMS = Number(timeInputVal) * 60 * 1000;
    console.log(peoplesNamesArr);

    // future plan: run function to clear window contents and add options to put names of people. Cleaner. See for loop in createSecontForm function that I commented out

    // populate stopwatch area
    stopwatchArea.innerText = "";

    createStopwatchArea(people, timerState.timeLeftMS, peoplesNamesArr);
  }
});

function timerFunc(){
  // placeholder func. Need to add functionality (will call timer display DOM functions and update timer object)
  console.log("timer func being called")
}

function updateTimerStateObj(){
  // placeholder func to update timerState.timeLeft value, and the specific presenter's time taken
  if (timerState.timerActive === false){
    console.log("Timer apparently not active")
  }
}

// main timer event listener function
mainStartBtn.addEventListener("click", function(){
  var intervalID = window.setInterval(timerFunc, 1000)

  console.log("main start btn working!")
})

// function to create stopwatch area
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
    (minsPerPerson/60000).toPrecision(2) +
    " minutes";

  timerArea.classList.remove("hidden"); // display main timer
  areaIntro.classList.add("notice");
  noticeArea.appendChild(areaIntro);

  createTimerObjects(minsPerPerson, pplArr);
  createPeoplesDivs();
  // then call a function to add event listener to stopwatch area
  stopwatchAreaListener();
}

// WORK IN PROGRESS - CURRENTLY OVERLAPS WITH FUNCTIONALITY OF OTHER FUNCTIONS EG BUTTON
// stopwatchAreaListener = function(){
//   console.log("stopwatchAreaListener")
//   document.getElementById("stopwatch-area").addEventListener("click", x => x.target.parentElement.childNodes.forEach(y => {
//     if(x.target.id !== y.id && x.target.id.includes("presenter")){
//       y.classList.remove("selected")
//       y.classList.add("normal")
//     } else if (x.target.id === y.id && x.target.id.includes("presenter")){
//       y.classList.remove("normal")
//       y.classList.add("selected")
//     }
//   }));
// }

stopwatchAreaListener = function(){
  console.log("stopwatchAreaListener")
  document.getElementById("stopwatch-area").addEventListener("click", x => {
    if(x.target.id.includes("presenter")){
      x.target.parentElement.childNodes.forEach(y => {
        if(x.target.id !== y.id){
          y.classList.remove("selected")
          y.classList.add("normal")
        } else if (x.target.id === y.id){
          y.classList.remove("normal")
          y.classList.add("selected")
        }
      })
    }
});
}

// stopwatchAreaListener = function(){
//   document.getElementById("stopwatch-area").addEventListener("click", x => x.target.parentElement.childNodes.forEach(y => console.log(y.classList)));
// }

// function to make objects to track peoples' time
function createTimerObjects(timeMS, pplNames) {
  console.log("Run: createTimerObjects");
  pplNames.forEach((p, i) => {
    timerState["presenter_" + i] = {
      name: p,
      timeAllocMS: timeMS,
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
  presenterDiv.classList.add("normal");
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
