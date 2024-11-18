const PlayScreenControl = function (firstPlayerName, secondPlayerName, row) {
    const fieldContainer = document.querySelector('.field')
    const playScreen = document.querySelector('.play-screen')
    const playerOneDiv = document.querySelector('#player-1')
    const playerTwoDiv = document.querySelector('#player-2')
    const moveDescription = document.querySelector('#move')
    const resetBtn = document.querySelector('#reset')
    const backBtn = document.querySelector('#back')
    let gameActiveState = true
    const game = GameControl(firstPlayerName, secondPlayerName, row)
    const field = game.field

    const getToken = () => game.getActiveTurn().token

    game.evaluateMaxDepth()

    // Функция рендерит игровое поле, как грид
    let cols = row
    const renderField = () => {
        const fieldWrap = document.createElement("div")
        fieldWrap.id = "field-wrapper"
        fieldContainer.append(fieldWrap)
        let rows = 0
        field.forEach(el => {
            let columns = 0
            for (let cell of el) {
                const btn = document.createElement('div')
                btn.innerText = cell.getValue()
                btn.role = 'button'
                btn.className = 'cell'
                btn.dataset.column = columns++
                btn.dataset.row = rows
                if (columns === cols + 1)
                    columns = 0
                fieldWrap.append(btn)
            }
            rows++
        })
        fieldWrap.style.display = 'grid'
        fieldWrap.style.gridTemplateColumns = `repeat(${cols + 1}, 1fr)`
        fieldWrap.addEventListener('click', handleClick)
    }

    // Update data and render on click if have changes
    const handleClick = (e) => {
        if (gameActiveState) {
            const target = e.target
            const token = getToken()
            const coords = target.dataset
            const row = coords.row
            const col = coords.column
            if (target.innerText !== defaultSymbol)
                return;
            // update field data
            field[row][col].setValue(token)
            // update cell rendering
            target.innerText = token
            // update zobrist transposotion table
            //game.initialHash = game.updateHash(game.initialHash, row, col, defaultSymbol ,token)
            game.initialHash ^= game.zobristTable[row][col][token]
            // Check end
            let result = game.checkEnd(row, col)
            game.turnMove()
            controlMove(result)
            // Блокируем клик, если один игрок
            if (typeof aiStrategy !== "undefined" && typeof result === "undefined") {
                makeAiMove()
            }
        }
    }

    // Change player's name into Cross player;s name and noliki player's name
    const renderPlayers = () => {
        const nameDivOne = document.createElement("div")
        nameDivOne.id = "player-name-div-1"
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        const nameDivTwo = document.createElement("div")
        nameDivTwo.id = "player-name-div-2"
        nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

        playerOneDiv.prepend(nameDivOne)
        playerTwoDiv.prepend(nameDivTwo)
    }

    const resetField = () => {
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

    // Сделать просто changeMove, и добавлять аттрибут актив терн, чтобы подсвечивать рамку
    const controlMove = (isEnd) => {
        if (isEnd === 'win') {
            game.turnMove()
            moveDescription.innerText = `${game.getActiveTurn().playerName} is the winner. Congratulation!`
            gameActiveState = false
        } else if (isEnd === 'draw') {
            moveDescription.innerText = `Draw. No one lose..`
            gameActiveState = false
        } else {
            moveDescription.innerText = `It is now ${game.getActiveTurn().playerName}'s turn!`
        }
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

    playScreen.style.display = 'block'
    renderPlayers()
    renderField()
    controlMove(false)
    resetBtn.addEventListener('click', handleReset)
    backBtn.addEventListener('click', handleBack)

    if (firstPlayerName === "AI" || secondPlayerName === "AI") {
        aiStrategy = firstPlayerName === "AI" ? "max" : "min"
        aiIdx = aiStrategy === "max" ? 0 : 1
        if (aiStrategy === "max") {
            makeAiMove()
        }
    }
}