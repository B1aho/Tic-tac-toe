// Cell fabric with private value
const Cell = function() {
    let value = '*'
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

    const initField = () => {
        for (let i = 0; i <= row; i++) {
            field[i] = []
            for (let j = 0; j <= column; j++) {
                field[i].push(Cell())
            }
        }
    }
    const getField = () => field

    const renderField = () => {
        let resultStr = ""
        for (let row of field) {
            resultStr += '[' + row.map((el) => el.getValue()) + ']' + '\n'
        }
        console.log(resultStr)
    }

    const makeMove = (rowNum, colNum, playerSym) => {
        if (field[rowNum][colNum].getValue() !== '*')
            return false;
        field[rowNum][colNum].setValue(playerSym)
        return true;
    }

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

    initField()

    return {
        getField,
        makeMove,
        checkEnd,
        renderField,
        initField,
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
    let gameState = 1;
    let activeTurn = players[0]
    let movesCounter = 0

    const getActiveTurn = () => activeTurn

    const turnMove = () => {
        activeTurn = activeTurn === players[0] ? players[1] : players[0]
        movesCounter++
    }

    const checkEnd = (row, col) => {
        if (movesCounter === 9) {
            fieldControl.renderField()
            draw()
            resetGame()
        }

        const haveWinner = fieldControl.checkEnd(row, col)
        if (haveWinner) {
            fieldControl.renderField()
            turnMove()
            win(activeTurn.token)
            resetGame()
        }
    }

    const makeMove = () => {
        fieldControl.renderField()
        const row = Number(prompt('Enter row'))
        const col = Number(prompt('Enter column'))

        if (fieldControl.makeMove(row, col, activeTurn.token)) {
            turnMove()
        }

        if (movesCounter >= 5) {
            checkEnd(row, col)
        }
    }

    const draw = () => {
        console.log('Draw. No winners or loser!')
    }

    const win = () => {
        console.log(activeTurn.playerName + ' win the game!. Congratulation!')
    }

    const resetGame = () => {
        const nextGame = prompt('Would you like to restart? Y/N')
        if (nextGame.toUpperCase().charAt(0) === 'Y') {
            fieldControl.initField()
            movesCounter = 0
            makeMove()
        } else {
            gameState = 0
        }
    }

    return {
        turnMove,
        checkEnd,
        resetGame,
        field: fieldControl.getField,
        getActiveTurn,
    }
}

const ScreenControl = function() {
    const fieldContainer = document.querySelector('.field')
    const playersContainer = document.querySelector('.playes')

    // Будем брать имена из формы
    const row = 2
    const col = 2
    const game = GameControl('Mike', 'Julia', row, col)
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
                btn.className = 'btn'
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

    const getToken = () => game.getActiveTurn().token

    // Update data and render on click if have changes
    const handleClick = (e) => {
        const target = e.target
        const token = getToken()
        const coords = target.dataset
        if (target.innerText !== '*')
            return;
        // update field data
        field[coords.row][coords.column].setValue(token)
        // update cell rendering
        target.innerText = token
        game.turnMove()
    }
 
    renderField()
}

ScreenControl()