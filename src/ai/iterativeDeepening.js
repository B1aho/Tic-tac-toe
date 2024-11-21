import { getPossibleMoves, sortMovesByHeuristic, sortMoves, isBetterMove } from "./moveHelpers";

export const createIterativeDeeping = (state) => {
    const runSearch = (isMax, limits) => {
        limits.maxDepth++
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
        for (let currDepth = size < 4 ? 1 : 3; currDepth <= limits.maxDepth; currDepth++) {
            possibleMoves = sortMoves(possibleMoves, players[idx].token, currDepth - 1)
            for (const move of possibleMoves) {
                // Выполнить ход
                state.applyMove(move)
                // Вызов рекурсивного минимакса с альфа-бета отсечением
                const score = minimax(0, !isMax, move[0], move[1], -Infinity, Infinity, Hash, currDepth)
                // Откатить ход
                state.applyMove(move)
                // Обновить лучший счёт
                if (isBetterMove(score, bestScore, isMax)) {
                    bestScore = score
                    bestMove = [move[0], move[1]]
                }
                if (Date.now() - startTime > limits.timeOut) {
                    console.log("Last move: " + move + ". On depth = " + currDepth)
                    breakFlag = true
                    break;
                }
            }
            if (breakFlag)
                break
        }
        state.applyMove(bestMove)
        return bestMove
    }
    return { runSearch }
}
