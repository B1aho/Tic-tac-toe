// Разбей всё по модулям, после того как доделаешь игру, чекни как правильно рефакторить такой код
// Добавить векторную графику и ИИ

// Cell module with private value
const defaultSymbol = '*'
const Cell = function() {
    let value = defaultSymbol
    const getValue = () => {
        return value;
    }

    const setValue = (x) => {
        value = x
    }

    return {
        getValue,
        setValue,
    }
}

// Game field with the grid of cells. Object represent all logic about manipulations on the field and private field
const GameField = function(row) {
    const field = []

    const initField = (() => {
        for (let i = 0; i <= row; i++) {
            field[i] = []
            for (let j = 0; j <= row; j++) {
                field[i].push(Cell())
            }
        }
    })()

    const resetField = () => {
        field.forEach(el => el.forEach(cell => cell.setValue(defaultSymbol)))
    }

    const getField = () => field

    // Наверное разумнее чтобы он просто от клетки где был ход пошел поочереди во все стороны
    // Можно сделать так, что три зачеркивания нужно для поля 3х3 и 4х4, для остальный полей 4 зачеркивания
    const checkEnd = (rw, cl) => {
        const token = field[rw][cl].getValue()
        const winLine = row > 3 ? 4 : 3
        // Check win in a row 
        let oneRow = 0
        for (el of field[rw]) {
            if (el.getValue() === token) {
                oneRow++
                if (oneRow >= winLine)
                    return true
            } else {
                oneRow = 0
            }
        }
        // Check win in a column
        let oneColumn = 0
        for (el of field) {
            if (el[cl].getValue() === token) {
                oneColumn++
                if (oneColumn >= winLine)
                    return true
            } else {
                oneColumn = 0
            }
        }
        // Check win in a diagonals
        let mainX = rw
        let mainY = cl
        let mainDiag = 0
        while (mainX > 0 && mainY > 0) {
            mainX--
            mainY--
        }
        for (let i  = mainX, j = mainY; i <= row && j <= row; i++, j++) {
            if (field[i][j].getValue() === token) {
                mainDiag++
                if (mainDiag >= winLine)
                    return true
            } else {
                mainDiag = 0
            }
        }
  
        let secondX = rw
        let secondY = cl
        let secondDiag = 0
        while (secondX < row && secondY > 0) {
            secondX++
            secondY--
        }
        for (let i  = secondX, j = secondY; i >= 0 && j <= row; i--, j++) {
            if (field[i][j].getValue() === token) {
                secondDiag++
                if (secondDiag >= winLine)
                    return true
            } else {
                secondDiag = 0
            }
        }
    }

    return {
        getField,
        checkEnd,
        resetField,
    }
}

// Game module. All game loop logic here
const GameControl = function( playerOne = 'Player-One', playerTwo = 'Player-Two', rows) {
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
    const fieldControl = GameField(rows)
    let activeTurn = players[0]
    let movesCounter = 0
    // рассчитываем по row
    let minMovesToCheck = 4
    let maxMoves = (rows + 1) * (rows + 1) - 1
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
        let field = fieldControl.getField()
        console.table(field.map(el => el.map(cell => cell.getValue())))
        fieldControl.resetField()
        console.table(field.map(el => el.map(cell => cell.getValue())))
        movesCounter = 0
        activeTurn = players[0]
    }

    return {
        turnMove,
        checkEnd,
        resetGame,
        field: fieldControl.getField,
        getActiveTurn,
    }
}

const PlayScreenControl = function(firstPlayerName, secondPlayerName, row) {
    const fieldContainer = document.querySelector('.field')
    const playScreen = document.querySelector('.play-screen')
    const playerOneDiv = document.querySelector('#player-1')
    const playerTwoDiv = document.querySelector('#player-2')
    const moveDescription = document.querySelector('#move')
    const resetBtn = document.querySelector('#reset')
    const backBtn = document.querySelector('#back')

    firstPlayerName = firstPlayerName === "" ? "AI" : firstPlayerName
    secondPlayerName = secondPlayerName === "" ? "AI" : secondPlayerName

    const game = GameControl(firstPlayerName, secondPlayerName, row)
    const field = game.field()
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
    let gameActiveState = true
    const getToken = () => game.getActiveTurn().token

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

            let result = game.checkEnd(row, col)
            game.turnMove()
            controlMove(result)
        }
    }
    // Change player's name into Cross player;s name and noliki player's name
    const renderPlayers = () => {
        nameDivOne = document.createElement("div")
        nameDivOne.id = "player-name-div-1"
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        nameDivTwo = document.createElement("div")
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
        game.resetGame()
        resetField()
        controlMove(false)
        gameActiveState = true
    }

    // Нужно удалить всё что тут было нарисовано и отключить слушатели
    // плей сркин рисовать придется каждый раз заново, так как разнын настройки
    const handleBack = () => {
        fieldContainer.removeEventListener('click', handleClick)
        resetBtn.removeEventListener('click', handleReset)
        backBtn.removeEventListener('click', handleBack)
        fieldWrap = document.querySelector("#field-wrapper")
        nameDivOne = document.querySelector("#player-name-div-1")
        nameDivTwo = document.querySelector("#player-name-div-2")
        optionScreen = document.querySelector(".option-screen")
        fieldWrap.remove()
        nameDivOne.remove()
        nameDivTwo.remove()
        playScreen.style.display = "none"
        optionScreen.style.display = "block"
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
    playScreen.style.display = 'block'
    renderPlayers()
    renderField()
    controlMove(false)
    resetBtn.addEventListener('click', handleReset)
    backBtn.addEventListener('click', handleBack)
}

OptionScreenControl = function() {
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