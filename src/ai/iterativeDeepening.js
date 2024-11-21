import { getPossibleMoves, sortMovesByHeuristic, sortMoves, isBetterMove } from "./moveHelpers";

export const createIterativeDeeping = (state) => {
    const runSearch = (search, limits) => {
        limits.maxDepth++
        let bestScore = state.isMax ? -Infinity : Infinity
        let bestMove = null
        let breakFlag = false
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves(state.field);
        if (state.field.length >= 4) {
            possibleMoves = sortMovesByHeuristic(possibleMoves)
        }
        let startTime = Date.now()
        // Вместо remaining moves использовать просто длину possiblemoves ??
        for (let currDepth = state.field.length <= 4 ? 1 : 3; currDepth <= limits.maxDepth; currDepth++) {
            possibleMoves = sortMoves(possibleMoves, isMax ? "X" : "O", currDepth - 1)
            for (const move of possibleMoves) {
                // Выполнить ход
                // Добавить флаг undo, чтобы понимать, когда счетчик ходов увеличиваем, а когда уменьшаем
                state.applyMove(move)
                state.movesCounter++
                // Вызов рекурсивного минимакса с альфа-бета отсечением
                const score = search(state, currDepth, move)
                // Откатить ход
                state.applyMove(move)
                state.movesCounter--
                // Обновить лучший счёт
                if (isBetterMove(score, bestScore, state.isMax)) {
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
