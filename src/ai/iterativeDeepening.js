

const better = (a, b, isMax) => {
    if (isMax) {
        return a > b
    } else
        return a < b
}

const MAX_TIME = 6000
let MAX_DEPTH_ITER = 0
const evaluateMaxDepth = () => {
    if (size === 2)
        MAX_DEPTH_ITER = 10
    else
        MAX_DEPTH_ITER = (size >= 4) ? 6 : 6
}

const iterativeDeeping = (field, idx, isMax) => {
    MAX_DEPTH_ITER++
    const hardMove = checkBestMoves()
    if (hardMove)
        return hardMove
    let bestScore = isMax ? -Infinity : Infinity
    let bestMove = null
    let breakFlag = false
    // Генерация и сортировка возможных ходов
    let possibleMoves = getPossibleMoves();
    if (size >= 3) {
        possibleMoves = sortMovesByHeuristic(possibleMoves)
    }
    let startTime = Date.now()
    // Вместо remaining moves использовать просто длину possiblemoves ??
    // let currDepth = movesCounter <= 2 ? 3 : 1
    for (let currDepth = size < 4 ? 1 : 3; currDepth <= MAX_DEPTH_ITER; currDepth++) { // Чем больше условие ставлю, тем больше итераций делает - проблема
        possibleMoves = sortMoves(possibleMoves, players[idx].token, currDepth - 1)
        for (const move of possibleMoves) {
            // Выполнить ход
            field[move[0]][move[1]].setValue(players[idx].token)
            //   Hash = updateHash(Hash, move[0], move[1], prevToken, players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            // Рекурсивный вызов минимакса
            const score = minimax(0, !isMax, move[0], move[1], -Infinity, Infinity, Hash, currDepth)
            // Откатить ход
            field[move[0]][move[1]].setValue(defaultSymbol)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            // Обновить лучший счёт
            if (better(score, bestScore, isMax)) {
                bestScore = score
                bestMove = [move[0], move[1]]
            }
            if (Date.now() - startTime > MAX_TIME) {
                console.log("Last move: " + move + ". On depth = " + currDepth)
                breakFlag = true
                break;
            }
        }
        if (breakFlag)
            break
    }
    field[bestMove[0]][bestMove[1]].setValue(players[idx].token)
    Hash ^= zobristTable[bestMove[0]][bestMove[1]][players[idx].token]
    return bestMove
}
