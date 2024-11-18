const resetGame = () => {
    console.table(field.map(el => el.map(cell => cell.getValue())))
    fieldControl.resetField()
    console.table(field.map(el => el.map(cell => cell.getValue())))
    movesCounter = 0
    activeTurn = players[0]
    initialHash = initHash()
    transpositionTable.clear()
    evaluateMaxDepth()
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


// На плэй вешаем событие после загрузки дом дерева и начинаем всю инициализацию там
const handlePlay = () => {
    xName = xInput.value
    oName = oInput.value
    const size = document.querySelector('input[name="size"]:checked').value
    const players = Number(document.querySelector('input[name="players-number"]:checked').value)
    if (haveNames(players)) {
        console.log('have names')
        optionScreen.style.display = "none"
        screenChange(optionScreen, playScreen)
        xName = xName === "" ? "AI" : xName
        oName = oName === "" ? "AI" : oName
        currentOptions.player1.name = xName
        currentOptions.player2.name = oName
        currentOptions.gridSize = size
        currentOptions.playersNumber = players
        renderField(size)
        renderPlayers(xName, oName)
        document.querySelector("#two-players").checked = true
    } else {
        console.log('dont have names')
        // Подсветить красным инпуты
    }
}

playBtn.addEventListener("click", handlePlay)

controlMove("другое")