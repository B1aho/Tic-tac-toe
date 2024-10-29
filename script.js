/* Крестики-нолики: 
игровое поле - метод отрисовки поля, метод возвращающий поле, метод делающий ход, метод проеряющий победу или отсутсвие ходов на поле
клетка поля - метод получения значения клетки, метод изменения значения клетки
состояние игры - метод перехода хода, два игрока, счетчик ходов, метод проверки конца игры - начиная с 5го хода (каждый ход)
[
    [0, 0, х],
    [0, X, 0],
    [х, 0, 0],
]
*/
const GameField = (function() {
    const row = 3
    const column = 3
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

    const renderFiled = () => {
        for (let i = 0; i <= row; i++) {
            if (i > 0)
                console.log( '\n' )
            for (let j = 0; j <= column; j++) {
                console.log('[' + field[i][j] + ']')
            }
        } 
    }

    const makeMove = (rowNum, colNum, playerSym) => {
        if (field[rowNum][colNum].getValue())
            return 0;
        field[rowNum][colNum].setValue(playerSym)
        return 1;
    }

    const checkEnd = (row, col) => {
        const token = field[row][col].getValue()

        // Check win in a row
        const row = field[row].filter((el) => el.getValue === token)
        if (row.length === 3) {
            return true;
        }

        // Check win in a column
        const column = field.filter((el) => el[col].getValue() === token)
        if (column.length === 3) {
            return true;
        }

        // Check win in a diagonals
        const validDiagonal = [[0,0], [2,2], [0,2], [2,0], [1,1],]
        const idx = validDiagonal.indexOf([row, col])
        if (idx >= 0) {
            const mainDiag = (field[0][0] === field[1][1] === field[2][2]) ? true : false
            const secondaryDiag = (field[0][2] === field[1][1] === field[2][0])
            if (idx < 2) {
                return mainDiag;
            } else if (idx < 4) {
                return secondaryDiag;
            } else {
                return (mainDiag || secondaryDiag) ? true : false;
            }
        }
    }

    initField()

    return {
        getField,
        makeMove,
        checkEnd,
        renderFiled,
        initField,
    }
})()

const Cell = function() {
    const value = 0
    
    const getValue = () => {
        return value
    }

    const setValue = (x) => {
        value = x
    }

    return {
        getValue,
        setValue,
    }
}

const GameControl = (function( playerOne = 'Player One', playerTwo = 'Player Two' ) {
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
    const field = GameField.getField()
    
    const activeTurn = players[0]
    const movesCounter = 0

    const turnMove = () => {
        activeTurn = activeTurn === players[0] ? players[1] : players[0]
        movesCounter++
    }

    const checkEnd = (row, col) => {
        if (movesCounter === 9) {
            draw()
            resetGame()
        }

        const haveWinner = field.checkEnd(row, col)
        if (haveWinner) {
            win(activeTurn.token)
            resetGame()
        }
    }

    const makeMove = () => {
        const row = prompt('Enter row')
        const col = prompt('Enter column')

        if (field.makeMove(row, col, activeTurn.token)) {
            turnMove()
            field.renderFiled()
        }

        if (movesCounter > 5) {
            checkEnd(row, col)
        }
    }

    const draw = () => {
        console.log('Draw. No winners or loser!')
    }

    const win = () => {
        console.log('Player - ' + activeTurn.playerName + ' win the game!. Congratulation!')
    }

    const resetGame = () => {
        const nextGame = prompt('Would you like to restart? Y/N')
        if (nextGame.toUpperCase().charAt(0) === 'Y') {
            field.initField()
            field = getField()
            makeMove()
        }

    }

    makeMove()
})() 