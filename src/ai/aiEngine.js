const MAX_TIME = 6000

let MAX_DEPTH_ITER = 0
const evaluateMaxDepth = (size) => {
    if (size === 2)
        MAX_DEPTH_ITER = 10
    else
        MAX_DEPTH_ITER = (size >= 4) ? 6 : 6
}
// Тоже в state будет метод
const applyMove = (move) => {
    this.field[move[0]][move[1]].setValue(players[idx].token)
    this.hash ^= zobristTable[move[0]][move[1]][players[idx].token]
}

// Проверяем ходы до алгоритма углубления
const hardMove = checkBestMoves(state.movesCounter, state.field)
if (hardMove)
    return hardMove