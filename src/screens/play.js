// Возможно экрану не надо ничего получать, он если запсукается, то имена берет из инпутов и потом очищает их. 
// Еще можно добавить флаг АИ. Если он указан то импортируем АИ 
const fieldContainer = document.querySelector('.field')
export const playScreen = document.querySelector('.play-screen')
const playerOneDiv = document.querySelector('#player-1')
const playerTwoDiv = document.querySelector('#player-2')
export const moveDescription = document.querySelector('#move')
const resetBtn = document.querySelector('#reset')
const backBtn = document.querySelector('#back')

export const renderField = (size) => {
    const fieldWrap = document.createElement("div")
    fieldWrap.id = "field-wrapper"
    fieldContainer.append(fieldWrap)

    for (let rows = 0; rows < size; rows++) {
        for (let columns = 0; columns < size; columns++) {
            const btn = document.createElement('div')
            btn.innerText = '*'
            btn.role = 'button'
            btn.className = 'cell'
            btn.dataset.column = columns++
            btn.dataset.row = rows
            if (columns === size + 1)
                columns = 0
            fieldWrap.append(btn)
        }
    }
    fieldWrap.style.display = 'grid'
    fieldWrap.style.gridTemplateColumns = `repeat(${size + 1}, 1fr)`
}


// Change player's name into Cross player;s name and noliki player's name
export const renderPlayers = (firstPlayerName, secondPlayerName) => {
    const nameDivOne = document.createElement("div")
    nameDivOne.id = "player-name-div-1"
    nameDivOne.innerText = `First player's name: ${firstPlayerName}`

    const nameDivTwo = document.createElement("div")
    nameDivTwo.id = "player-name-div-2"
    nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

    playerOneDiv.prepend(nameDivOne)
    playerTwoDiv.prepend(nameDivTwo)
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
