export const checkBestMoves = () => {
    if (size === 4) {
        if (movesCounter === 0 || movesCounter === 1 && field[2][2].getValue() === defaultSymbol) {
            let move = bestAiMoves.firstIn5
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move
        } else if (movesCounter === 1) {
            let move = bestAiMoves.secondIn5
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move

        }
    } // Прописать первый ходы за нолики в центр, но если в центре есть соперник то по диагонали к нему. Потом вынести в отдел функцию
    else if (size === 5) {
        if (movesCounter === 1) {
            let leftTop = field[2][2]
            let rightTop = field[2][3]
            let leftBottom = field[3][2]
            let rightBottom = field[3][3]
            if (leftTop.getValue() !== defaultSymbol) {
                rightBottom.setValue(players[idx].token)
                Hash ^= zobristTable[3][3][players[idx].token]
                return [3, 3]
            } else if (rightTop.getValue() !== defaultSymbol) {
                leftBottom.setValue(players[idx].token)
                Hash ^= zobristTable[3][2][players[idx].token]
                return [3, 2]
            } else if (leftBottom.getValue() !== defaultSymbol) {
                rightTop.setValue(players[idx].token)
                Hash ^= zobristTable[2][3][players[idx].token]
                return [2, 3]
            } else if (rightBottom.getValue() !== defaultSymbol) {
                leftTop.setValue(players[idx].token)
                Hash ^= zobristTable[2][2][players[idx].token]
                return [2, 2]
            } else {
                let move = bestAiMoves.firstIn6
                field[move[0]][move[1]].setValue(players[idx].token)
                Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
                return move
            }
        } else if (movesCounter === 0) {
            let move = bestAiMoves.firstIn6
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move
        }
    }
}
 


const scores = {
    win: 10000,
    lose: -10000,
    draw: 0,
}

// Захардкодить лучшие ходы для разных ситуаций, лучше объект, где свойства своим именем поисывают ситуацию для хода
const bestAiMoves = {
    firstIn5: [2, 2],
    secondIn5: [1, 1],
    firstIn6: [2, 2],
    secondIn6: [2, 3],
}
