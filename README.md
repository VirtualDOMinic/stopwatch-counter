# Stopwatch/Counter/Countdown Readme

## Intro
Each week at Founders & Coders (the full-stack JS bootcamp that I attended from July to mid-October, 2018) we had two afternoons that involved group presentations: one where we presented technical topics that we had researched, and another where we would present that week's group project.

After a few weeks, I noticed that some people (myself included) were often talking much more in presentations than others. I felt bad about this, and wanted to create a tool to help people to see how long each person was talking for, so that mentors/teams could hold eachother accountable and ensure that the quieter/less confident people could have a chance to talk if they would like to.

### What is this tool useful for?
* Easily measuring how long each person talks for in a group presentations
* Pitch practice: timing how long each section of a pitch/talk takes you
    * Type section names instead of person names in the input

## 'To do's and general improvements
See project issues for more. Key points below:
- [x] Use `Date.now()` for more accurate timings
- [ ] Extend timer functionality to include hours `HH:MM:SS`
- [ ] Improve colour scheme/design
- [ ] General refactoring (includes CSS)
- [ ] Show how much time the talk has gone over by once the countdown timer reaches `0:00`
- [ ] Make a sound when time is up
- [ ] Tests
- [ ] Floating info/tips icon
- [ ] Redo this project in React (Native)? Add more features, such as cooking timers, intro screen, etc. 

## Technical overview
### Tech "stack"
* Very simple: vanilla JS (no libraries or frameworks), HTML & CSS
* No packages, node, etc., so this project can be run by simply opening the index.html in a browser

### Casual code walkthrough of `script.js`
Lines 1-18:
* Lots of `document.getElementById` and `document.getElementsByName` to allow for accessing many of the elements in the DOM. 

`var intervalID`:
* Provides access to current `window.setInterval()` ID so it can be removed before a subsequent form submission creates a new one. Can likely be done another way (very low priority).

`if(!window)`:
* Just in case someone tries to run this script in an environment that doesn't have a `window` (e.g. node)
* Likely unnecessary, or should be refactored to throw the error rather than just a `console.log()`

`var timerState`:
* Global "state" object accessible by all timer components
* State stores "created" key that tells the script to refresh the state and the stopwatch elements on the page if it's already been created once. Seen in `if(timerState.created)` block inside the `validateInputsAndCreateArea` function
* `presenterSelected` is used by the `updateTimerStateObj` function to add time taken to the presenter who's selected (if anyone is)

`firstForm.addEventListener("submit"...`
Calls the below function when someone clicks submit on the first form (the one that asks for the number of presenters, their names, and total time) 

`validateInputsAndCreateArea(event)`
* Probably needs a better name, and to be modularised more and to be DRYer for better maintainability/readability. 
* `// input validation` section:
    * RegEx used to check that only integers have made it through the first input, and that the number of names (comma separated) matches the specified number in the first input
    * Displays error description to user as a `.notice` (styled class) that appears where the welcome message once was
* If validation passes, run the `createStopwatchArea()` function and then use `scrollIntoView()` to ensure the user can see the notice, timer, etc.
* 
