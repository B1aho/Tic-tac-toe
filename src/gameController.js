import { currentOptions } from "./screens/controller"
import { createField } from "./gameField"
import { checkWIn } from "./terminalState"
import { moveDescription } from "./screens/play"

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

export { currentOptions }