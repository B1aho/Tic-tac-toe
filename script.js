"use strict";

let BenchCount = 0

// Game module. All game loop logic here
const GameControl = function (playerOne = 'Player-One', playerTwo = 'Player-Two', size) {
    const players = [
        {
            playerName: playerOne,
            token: 'X'
        },
        {
            playerName: playerTwo,
            token: 'O'
        }
    ]

    const fieldControl = GameField(size)
    const field = fieldControl.getField()

    let MAX_DEPTH_ITER = 0

    const evaluateMaxDepth = () => {
        if (size === 2)
            MAX_DEPTH_ITER = 10
        else
            MAX_DEPTH_ITER = (size >= 4) ? 6 : 6
    }

    evaluateMaxDepth() // Пока глобально поставлю, потом в модуле, это для настройки оптимальной


    // https://en.wikipedia.org/wiki/Zobrist_hashing
    // Добавить всё что с аи в отдельный модуль, можно внутри гейм контрол мб, он будет активироваться, только если 
    // выбрана игра с аи. Загуглить норма практика ли модуль в модуле

    let activeTurn = players[0]
    let movesCounter = 0
    // рассчитываем по row
    let minMovesToCheck = 4
    let maxMoves = (size + 1) * (size + 1) - 1
    const getActiveTurn = () => activeTurn

    const turnMove = () => {
        activeTurn = activeTurn === players[0] ? players[1] : players[0]
        movesCounter++
    }

    const checkEnd = (row, col) => {
        if (movesCounter >= minMovesToCheck && fieldControl.checkEnd(Number(row), Number(col))) {
            return "win"
        } else if (movesCounter === maxMoves) {
            return 'draw';
        }
    }

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

    return {
        turnMove,
        checkEnd,
        resetGame,
        field,
        getActiveTurn,
        moveAi,
        initialHash,
        zobristTable,
        evaluateMaxDepth,
        transpositionTable,
    }
}

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

const OptionScreenControl = function () {
    const playBtn = document.querySelector(".play-btn")
    const xInput = document.querySelector("#player-x-input")
    const oInput = document.querySelector("#player-o-input")
    const choosePlayers = document.querySelector(".players-radio")
    const optionScreen = document.querySelector(".option-screen")
    const handlePlay = () => {
        const row = document.querySelector('input[name="field"]:checked').value
        const players = Number(document.querySelector('input[name="players-number"]:checked').value)
        if (haveNames(players)) {
            console.log('have names')
            optionScreen.style.display = "none"
            xInput.value = xInput.value === "" ? "AI" : xInput.value
            oInput.value = oInput.value === "" ? "AI" : oInput.value
            PlayScreenControl(xInput.value, oInput.value, Number(row) - 1)
            document.querySelector("#two-players").checked = true
            resetInputs()
        } else {
            console.log('don have names')
            // Подсветить красным инпуты
        }
    }
    const haveNames = (playersNum) => {
        if (playersNum === 1) {
            return xInput.value !== "" || oInput.value !== "" ? true : false
        } else if (playersNum === 2) {
            return xInput.value !== "" && oInput.value !== "" ? true : false
        }
    }

    // If input value have non-empty string, other input block. If input value empty then all inputs avaliable
    const handleInputBlock = (e) => {
        if (e.target === xInput) {
            if (xInput.value !== "") {
                oInput.disabled = true
            } else {
                oInput.disabled = false
            }
        } else if (e.target === oInput) {
            if (oInput.value !== "") {
                xInput.disabled = true
            } else {
                xInput.disabled = false
            }
        }
    }

    const resetInputs = () => {
        xInput.removeEventListener("input", handleInputBlock)
        oInput.removeEventListener("input", handleInputBlock)
        oInput.disabled = false
        xInput.disabled = false
        xInput.value = oInput.value = ""
    }

    // If one player was choses then only on input should be available for name writing
    const handleInputs = (e) => {
        resetInputs()
        if (e.target.checked === true && e.target.value === "1") {
            xInput.addEventListener("input", handleInputBlock)
            oInput.addEventListener("input", handleInputBlock)
        }
    }
    playBtn.addEventListener("click", handlePlay)
    choosePlayers.addEventListener("change", handleInputs)
}

OptionScreenControl()