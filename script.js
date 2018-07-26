var timer = document.getElementById("timer");
var numberOfPeople = document.getElementsByName("number-of-people")[0];
var timeInput = document.getElementsByName("time-minutes")[0];
var submit = document.getElementById("submit-btn-1")
var firstForm = document.getElementById("first-form")
var welcomeMsg = document.getElementById("welcome-msg");
var welcome = document.getElementById("welcome");

var people = 0;
var startTime = 0; //minutes


// submit.addEventListener("");

firstForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var peopleInputVal = numberOfPeople.value;
    var timeInputVal = timeInput.value;

    if (peopleInputVal.match(/[^0-9]/g) || timeInputVal.match(/[^0-9]/g)) {
        welcomeMsg.innerText = "Please check your inputs! Thanks"
        welcomeMsg.classList.add("notice")
    } else {
        people = Number(peopleInputVal);
        startTime = Number(timeInputVal);

        // future plan: run function to clear window contents and add options to put names of people. Cleaner. See for loop in createSecontForm function that I commented out
    }


});






// Future plans...

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