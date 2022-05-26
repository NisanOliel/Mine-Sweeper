'use strict'
var gBoard
var millisecond = 0
var seconds = 0
var minutes = 0
var interval
var isTimerOn




function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function changeLevel(elValue) {
    gLevel.SIZE = parseInt(elValue.value)
    switch (gLevel.SIZE) {
        case 4:
            gLevel.MINES = 2,
                gGame.lives = 2
            console.log('gGame.lives:', gGame.lives)
            break;
        case 8:
            gLevel.MINES = 12,
                gGame.lives = 3

            break;
        case 12:
            gLevel.MINES = 30,
                gGame.lives = 3

            break;
    }
    console.log('gLevel.MINES:', gLevel.MINES)
    init()

}


function startTimer() {
    interval = setInterval(timerWatch, 11)
    isTimerOn = true;
    millisecond = 0
    seconds = 0
    minutes = 0
}

function timerWatch() {
    millisecond += 11
    if (millisecond >= 1000) {
        millisecond = 0
        seconds++
        if (seconds === 60) {
            seconds = 0
            minutes++
        }
    }

    var ms = millisecond < 100 ? "0" + millisecond : millisecond
    var sec = seconds < 10 ? "0" + seconds : seconds
    var min = minutes < 10 ? "0" + minutes : minutes
    var elTimer = document.querySelector('.timer')
    elTimer.innerHTML = `${min} : ${sec} : ${ms}`

}


function resetTimer() {
    millisecond = 0
    seconds = 0
    minutes = 0
    if (isTimerOn) {
        clearInterval(interval)
    }
    isTimerOn = false;
    var elTimer = document.querySelector('.timer')
    elTimer.innerHTML = `0${minutes} : 0${seconds} : 00${millisecond}`
}



function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}
