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
const Cell = function() {
    let value = 0
    
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
        if (field[rowNum][colNum].getValue())
            return 0;
        field[rowNum][colNum].setValue(playerSym)
        return 1;
    }

    const checkEnd = (row, col) => {
        const token = field[row][col].getValue()

        // Check win in a row
        const oneRow = field[row].filter((el) => el.getValue === token)
        if (oneRow.length === 3) {
            return true;
        }

        // Check win in a column
        const oneColumn = field.filter((el) => el[col].getValue() === token)
        if (oneColumn.length === 3) {
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
        renderField,
        initField,
    }
})()

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
    const field = GameField
    let activeTurn = players[0]
    let movesCounter = 0

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
        field.renderField()
        const row = prompt('Enter row')
        const col = prompt('Enter column')

        if (field.makeMove(row, col, activeTurn.token)) {
            turnMove()
            field.renderField()
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