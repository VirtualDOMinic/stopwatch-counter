var timer = document.getElementById("timer");

var numberOfPeople = document.getElementsByName("number-of-people")[0];
var timeInput = document.getElementsByName("time-minutes")[0];
var namesInput = document.getElementsByName("names")[0];

var submit = document.getElementById("submit-btn-1");
var firstForm = document.getElementById("first-form");
var welcomeMsg = document.getElementById("welcome-msg");
var welcome = document.getElementById("welcome");

var stopwatchArea = document.getElementById("stopwatch-area");

// might not need these as globals
var people = 0;
var startTime = 0; //minutes

// Note to self...
if (!window) {
    console.log("no window object! This scripts gonna fail");
} else {
    console.log("woo theres a window!");
}

// first submit
firstForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var peopleInputVal = numberOfPeople.value;
    var timeInputVal = timeInput.value;
    var peoplesNamesArr = namesInput.value.split(", ");

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
    // create "overview" text description
    var areaIntro = document.createElement("p");

    var minsPerPerson = (time / ppl).toPrecision(2);

    areaIntro.textContent =
        "There are " +
        ppl +
        " people (" +
        pplArr.join(", ") +
        "), and each person has " +
        minsPerPerson +
        " minutes to present";
    areaIntro.classList.add("notice");
    stopwatchArea.appendChild(areaIntro);

    createTimerObjects(minsPerPerson, pplArr);
    createPeoplesDivs()
}

// function to make objects to track peoples' time
function createTimerObjects(mins, pplNames) {
    pplNames.forEach((p, i) => {
        window["presenter_" + i] = {
            name: p,
            timeAllocSecs: mins * 60,
            timeTakenSecs: 0
        };
    });
}

// function to create divs for each person, displaying time left, time taken and button to start/stop
function createPeoplesDivs() {
    // could use forEach here but not sure about browser support
    for (var i = 0; i < people; i++) {
        // call a function that creates each person's area, then loop through it in here, passing in the pplArr[i] as the argument each time

        //testing things out
        // var hi = document.createElement("p");
        // hi.textContent = window["presenter_" + i].name;
        // hi.id = "presenter_" + i;
        // stopwatchArea.appendChild(hi);

        createPeopleTest(i);


    }
}


function createPeopleTest(i){
    var personDiv = document.createElement("div");
    var timerButton = document.createElement("button");
    personDiv.classList.add("test-div");
    personDiv.id = "testID-" + i
    timerButton.innerText = "Click me!";
    timerButton.onclick = function () {console.log('wooo it works')}
    personDiv.appendChild(timerButton)
    stopwatchArea.appendChild(personDiv);
}




















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