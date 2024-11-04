// Добавить векторную графику и ИИ
// Добавить экран 

// Cell fabric with private value
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
const GameField = function(row, column) {
    const field = []

    const initField = (() => {
        for (let i = 0; i <= row; i++) {
            field[i] = []
            for (let j = 0; j <= column; j++) {
                field[i].push(Cell())
            }
        }
    })()

    const resetField = () => {
        field.forEach(el => el.forEach(cell => cell.setValue(defaultSymbol)))
    }

    const getField = () => field

    const checkEnd = (row, col) => {
        const token = field[row][col].getValue()

        // Check win in a single row
        const oneRow = field[row].filter((el) => el.getValue() === token)
        if (oneRow.length === 3) {
            return true;
        }

        // Check win in a single column
        const oneColumn = field.filter((el) => el[col].getValue() === token)
        if (oneColumn.length === 3) {
            return true;
        }

        // Check win in a diagonals
        const validDiagonal = [[0,0], [2,2], [0,2], [2,0], [1,1]]
        let found = false
        for (let i = 0; i < validDiagonal.length; i++){
            if (validDiagonal[i][0] === row && validDiagonal[i][1] === col) {
               found = true 
               break
            }
        }
        if (found) {
            const mainDiag = field[0][0].getValue() === token && field[1][1].getValue() === token && field[2][2].getValue() === token
            const secondaryDiag = field[0][2].getValue() === token && field[1][1].getValue() === token && field[2][0].getValue() === token
            return (mainDiag || secondaryDiag) ? true : false;
        }
    }


    return {
        getField,
        checkEnd,
        resetField,
    }
}

// Game module. All game loop logic here
const GameControl = function( playerOne = 'Player-One', playerTwo = 'Player-Two', rows = 2, cols = 2 ) {
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
    const fieldControl = GameField(rows, cols)
    let activeTurn = players[0]
    let movesCounter = 0
    // рассчитываем по row и col
    let minMovesToCheck = 4
    let maxMoves = 8
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

const PlayScreenControl = function(firstPlayerName, secondPlayerName) {
    const fieldContainer = document.querySelector('.field')
    const playScreen = document.querySelector('.play-screen')
    const playerOneDiv = document.querySelector('#player-1')
    const playerTwoDiv = document.querySelector('#player-2')
    const moveDescription = document.querySelector('#move')
    // Будем брать имена и размер из формы
    const row = 2
    const col = 2

    const game = GameControl(firstPlayerName, secondPlayerName, row, col)
    const field = game.field()
    // Функция рендерит игровое поле, как грид
    const renderField = () => {
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
                if (columns === col + 1) 
                    columns = 0
                fieldContainer.append(btn)
            }
            rows++
        })
        fieldContainer.style.display = 'grid'
        fieldContainer.style.gridTemplateColumns = `repeat(${col + 1}, 1fr)`
        fieldContainer.addEventListener('click', handleClick)
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
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        nameDivTwo = document.createElement("div")
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
    const resetBtn = document.createElement('button')
    resetBtn.addEventListener('click', handleReset)
    resetBtn.innerText = 'RESET'
    playScreen.append(resetBtn)

}

OptionScreenControl = function() {
    PlayScreenControl("Viktor", "Milana")
}
