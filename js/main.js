'use strict'
const MINE = '💣'
const FLAG = '🚩'
var gBoard
var clickCount = 0
var isRightClick

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2
}

function init() {
    gBoard = buildBoard()
    renderBoard()
    resetTimer()
    livesRender()
    clickCount = 0
    gGame.shownCount = 0

}

function buildBoard() {
    var size = gLevel.SIZE
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }
    // board[1][1].isMine = true
    // board[2][1].isMine = true
    randomMines(gLevel.MINES, board)
    setMinesNegsCount(board)
    return board
}


function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard[i].length; j++) {
            var className = (gBoard[i][j].isShown) ? 'show' : ''
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td class="${tdId}"  class="${className}" onclick="cellClicked(this,${i}, ${j})"oncontextmenu="cellMarked(event,this,${i},${j})"></td>`
        }
        strHtml += '</tr>';
    }
    var elGameBoard = document.querySelector('table.game-board');
    elGameBoard.innerHTML = strHtml
}

function countMineNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            board[i][j].minesAroundCount = countMineNeighbors(board, i, j);
        }
    }
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false || elCell.isMarked) return
    if (clickCount === 0) startTimer()
    var cellClicked = gBoard[i][j];
    console.log('gBoard[i][j]:', gBoard[i][j])

    // console.log('cellClicked:', cellClicked)
    // if (clickCount === 1) {
    //     randomMines(gLevel.MINES, gBoard)
    //     setMinesNegsCount(gBoard)
    // }

    if (cellClicked.isShown) return
    if (cellClicked.isMine) {
        gGame.lives--
        elCell.isShown = true
        elCell.innerText = MINE
        livesRender()
        if (gGame.lives === 0) {
            clearInterval(interval)
            showMines()
            var smiley = document.querySelector(`button.smiley`)
            smiley.innerText = '☠️'
            var alert = document.querySelector('.box-alert')
            alert.style.display = 'block'
            gGame.isOn = false
        }

    }

    cellClicked.isShown = true
    elCell.classList.add('show')
    gGame.shownCount++
    clickCount++

    if (!cellClicked.isMine) {
        if (cellClicked.minesAroundCount === 0) {
            expandShown(gBoard, i, j)
            cellClicked.isMarked = false
            elCell.innerText = ''
        } else {
            elCell.innerText = cellClicked.minesAroundCount
        }
    }
    if (checkGameOver()) {
        var smiley = document.querySelector(`button.smiley`)
        clearInterval(interval)
        smiley.innerText = '🤑'
        var alert = document.querySelector('.box-alert')
        alert.innerHTML = 'You WON!'
        alert.style.backgroundColor = 'green'
        alert.style.display = 'block'

        gGame.isOn = false

    }

}

function randomMines(count, board) {
    for (var i = 0; i < count; i++) {
        var idxI = getRandomInt(0, board.length - 1)
        var idxJ = getRandomInt(0, board.length - 1)
        if (!board[idxI][idxJ].isMine) {
            board[idxI][idxJ].isMine = true
        } else {
            count++
        }
    }
}


function cellMarked(ev, cell, i, j) {
    ev.preventDefault();
    var elCell = gBoard[i][j]
    if (elCell.isShown) {
        console.log('elCell:', elCell)
        return
    }
    if (elCell.isMarked) {
        elCell.isMarked = false
        cell.innerText = ''
        gGame.markedCount--
    } else {
        elCell.isMarked = true
        cell.innerText = FLAG
        gGame.markedCount++
    }

}

function checkGameOver() {
    var temp = (gLevel.SIZE ** 2) - gLevel.MINES
    console.log('gGame.shownCount:', gGame.shownCount)
    return (gGame.shownCount === temp)
}

function expandShown(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === +idxI && j === +idxJ) continue
            var cell = board[i][j]
            gGame.shownCount++
            cell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('show')
            if (cell.minesAroundCount === 0) {
                // expandShown(board, i, j)
                cell.isMarked = false
                elCell.innerText = ''
            }
            if (cell.minesAroundCount !== 0) {
                elCell.innerText = cell.minesAroundCount
                cell.isMarked = false
            }
        }
    }
}


function livesRender() {
    var elLives = document.querySelector('.box span')
    elLives.innerHTML = gGame.lives
}

function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                var mine = document.querySelector(`.cell-${i}-${j}`)
                mine.classList.add('show')
                mine.isShown = true
                mine.innerText = MINE
            }
        }
    }

}

