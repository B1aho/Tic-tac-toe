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

    for (let i = 0; i <= row; i++) {
        field[i] = []
        for (let j = 0; j <= column; j++) {
            field[i].push(Cell())
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

    return {
        getField,

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
    const players = 
    [
        {
            playerName: playerOne,
            token: 'X'
        },
        {
            playerName: playerTwo,
            token: 'O'
        }
    ]
})() 