/* 
Подумай над началом игры, мб лучше по другому цикл устроить и 
разберись с вводом и если не хотят продолжить до выйти из цикла
короче игровой модуль отредактируй состояние
*/
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

const GameField = (function() {
    const row = 2
    const column = 2
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

        // Check win in a row
        const oneRow = field[row].filter((el) => el.getValue() === token)
        if (oneRow.length === 3) {
            return true;
        }

        // Check win in a column
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
})()

const GameControl = (function( playerOne = 'Player-One', playerTwo = 'Player-Two' ) {
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
    const field = GameField
    let gameState = 1;
    let activeTurn = players[0]
    let movesCounter = 0

    const turnMove = () => {
        activeTurn = activeTurn === players[0] ? players[1] : players[0]
        movesCounter++
    }

    const checkEnd = (row, col) => {
        if (movesCounter === 9) {
            field.renderField()
            draw()
            resetGame()
        }

        const haveWinner = field.checkEnd(row, col)
        if (haveWinner) {
            field.renderField()
            turnMove()
            win(activeTurn.token)
            resetGame()
        }
    }

    const makeMove = () => {
        field.renderField()
        const row = Number(prompt('Enter row'))
        const col = Number(prompt('Enter column'))

        if (field.makeMove(row, col, activeTurn.token)) {
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
            field.initField()
            movesCounter = 0
            makeMove()
        } else {
            gameState = 0
        }
    }
    while (gameState)
        makeMove()
})() 