import { currentOptions } from "./screens/controller"
import { createField } from "./gameField"
import { checkWIn } from "./terminalState"
import { moveDescription, backBtn, resetBtn } from "./screens/play"

// Создаем наше игровое поле с данными 
// Это поле запихиваем в currentOptions, и все. Потом на back это поле будет удаляться как поле из объекта
// Прописывем здесь функцию определения терминальной стадии которая применяет одну из двух функций в зависимости 
// от currentOptions и экспортируем её. currentoptions переназвать как currentState
// 
currentOptions.field = createField(currentOptions.gridSize)
const fieldWrap = document.querySelector("#field-wrapper")
fieldWrap.addEventListener("click", handleClick)
controlMove(false)

export const checkTerminalState = (row, col) => {
    const maxMoves = Math.pow((currentOptions.gridSize + 1), 2) - 1
    if (currentOptions.movesCounter === maxMoves) {
        return "draw"
    }
    if (checkWIn(currentOptions.field, row, col))
        return "win"
}

const getActiveTurn = () => {
    if (currentOptions.player1.activeTurn) {
        return currentOptions.player1
    } else
        return currentOptions.player2
}

const turnMove = () => {
    const activePlayer = getActiveTurn()
    activePlayer.activeTurn = false
    if (currentOptions.player1 === activePlayer) {
        currentOptions.player2.activeTurn = true
    } else {
        currentOptions.player1.activeTurn = true
    }
    currentOptions.movesCounter++
}

// Update data and render on click if have changes
const handleClick = (e) => {
    const target = e.target
    const coords = target.dataset
    const row = coords.row
    const col = coords.column
    const token = getActiveTurn().token
    const result = checkTerminalState(row, col)
    if (target.innerText !== currentOptions.defaultSymbol)
        return;
    // update field data
    currentOptions.field.setValue(token)
    // update cell rendering
    target.innerText = token
    controlMove(result)
    if (result) {
        fieldWrap.removeEventListener("click", handleClick)
        return;
        // Диалогове окно с кнопкой back reset
    }
    turnMove()
    if (currentOptions.playersNumber === 1) {
        game.initialHash ^= game.zobristTable[row][col][token]
        makeAiMove()
    }
}

 // Сделать просто changeMove, и добавлять аттрибут актив терн, чтобы подсвечивать рамку
 const controlMove = (isEnd) => {
    const name = getActiveTurn().name
    if (isEnd === 'win') {
        // Поменять на get activePlayer
        moveDescription.innerText = `${name} is the winner. Congratulation!`
    } else if (isEnd === 'draw') {
        moveDescription.innerText = `Draw. No one lose..`
    } else {
        moveDescription.innerText = `It is now ${name}'s turn!`
    }
}

export const resetField = () => {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell) => cell.innerText = defaultSymbol)
}

const handleReset = () => {
    BenchCount = 0
    game.resetGame()
    resetField()
    controlMove(false)
    gameActiveState = true
    if (game.getActiveTurn().playerName === "AI") {
        makeAiMove()
    }
}

// Нужно удалить всё что тут было нарисовано и отключить слушатели
// плей сркин рисовать придется каждый раз заново, так как разнын настройки
const handleBack = () => {
    fieldContainer.removeEventListener('click', handleClick)
    resetBtn.removeEventListener('click', handleReset)
    backBtn.removeEventListener('click', handleBack)
    const fieldWrap = document.querySelector("#field-wrapper")
    const nameDivOne = document.querySelector("#player-name-div-1")
    const nameDivTwo = document.querySelector("#player-name-div-2")
    const optionScreen = document.querySelector(".option-screen")
    fieldWrap.remove()
    nameDivOne.remove()
    nameDivTwo.remove()
    BenchCount = 0
    playScreen.style.display = "none"
    optionScreen.style.display = "block"
    // game.evaluateMaxDepth()
    game.transpositionTable.clear()
}


const renderAiMove = (coords) => {
    const col = coords[1]
    const row = coords[0]
    document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`).innerText = getToken()
}

// Выбираем стратегию для компьютера в алгоритме minmax, а также блокируем клик на первый ход, если компьютер крестик
let aiStrategy
let aiIdx

const makeAiMove = () => {
    gameActiveState = false
    console.time("Ai move")
    const aiCoords = game.moveAi(aiIdx, aiStrategy === "max" ? true : false)
    console.timeEnd("Ai move")
    renderAiMove(aiCoords)
    console.log(BenchCount)
    BenchCount = 0
    const result = game.checkEnd(aiCoords[0], aiCoords[1])
    game.turnMove()
    controlMove(result)
    gameActiveState = result === "win" || result === "draw" ? false : true
}

resetBtn.addEventListener('click', handleReset)
backBtn.addEventListener('click', handleBack)

if (firstPlayerName === "AI" || secondPlayerName === "AI") {
    aiStrategy = firstPlayerName === "AI" ? "max" : "min"
    aiIdx = aiStrategy === "max" ? 0 : 1
    if (aiStrategy === "max") {
        makeAiMove()
    }
}

export { currentOptions }