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

