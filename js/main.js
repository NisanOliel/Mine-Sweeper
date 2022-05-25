'use strict'
const MINE = '💣'
const FLAG = '🚩'
var gBoard

var gLevel = {
    SIZE: 6,
    MINES: 2
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    gBoard = buildBoard()
    renderBoard()
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
    board[1][1].isMine = true
    board[2][1].isMine = true
    setMinesNegsCount(board)
    return board
}


function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount
            var className = (gBoard[i][j].isShown) ? 'show' : 'unShow'
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td id="${tdId}"  class="${className}" onclick="cellClicked(this,${i}, ${j})"></td>`
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
    if (gGame.isOn === false) return
    var cellClicked = gBoard[i][j];
    console.log('cellClicked:', cellClicked)

    if (cellClicked.isShown) return
    if (cellClicked.isMine) {
        elCell.innerHTML = MINE
        console.log('game over')
    }
    cellClicked.isShown = true
    if (!cellClicked.isMine) elCell.innerHTML = cellClicked.minesAroundCount

    elCell.classList.add('show')
    elCell.classList.remove('unShow')


    if (cellClicked.isMine === false && cellClicked.minesAroundCount === 0) {
        expandShown(elCell, i, j)

    }


}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j]
            if (cell.minesAroundCount === 0)
                cell.isShown = true
        }
    }
    renderBoard()

}
