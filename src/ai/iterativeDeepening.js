import { getPossibleMoves, sortMovesByHeuristic, isBetterMove } from "./moveHelpers.js";
import { getSharedState } from "../sharedState.js";
// Добавить флаг максимальной глубины!, иначе по сто раз смотрит терминалньую стади, если время не стоит ограничени
export const createIterativeDeeping = (state) => {
    const runSearch = (search, limits) => {
        limits.maxDepth++
        let bestScore = state.isMax ? -Infinity : Infinity
        let bestMove = null
        let breakFlag = false
        const token = state.isMax ? "X" : "O"
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves(state.field);
        if (state.field.length >= 4) {
            possibleMoves = sortMovesByHeuristic(possibleMoves)
        }
        let startTime = Date.now()
        // Вместо remaining moves использовать просто длину possiblemoves ??
        for (let currDepth = state.field.length < 4 ? 10 : 3; currDepth <= limits.maxDepth; currDepth++) {
            //possibleMoves = sortMoves(possibleMoves, state.isMax ? "X" : "O", currDepth - 1)
            for (const move of possibleMoves) {
                // Выполнить ход
                // Добавить флаг undo, чтобы понимать, когда счетчик ходов увеличиваем, а когда уменьшаем
                state.applyMove(move, token)
                state.movesCounter++
                // Вызов рекурсивного минимакса с альфа-бета отсечением
                const score = search(state, currDepth, move)
                // Откатить ход
                state.undoMove(move)
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
            //possibleMoves = sortMoves(possibleMoves, state.isMax ? "X" : "O", currDepth - 1)
            if (breakFlag)
                break
        }
        state.applyMove(bestMove, token)
        return bestMove
    }
    return { runSearch }
}


function sortMoves(possibleMoves, playerToken, depthLimit) {
    const state = getSharedState()
    // Создаем массив с оценками ходов
    let evaluatedMoves = possibleMoves.map(move => {
        // Применяем ход
        state.applyMove(move, playerToken)
       // field[move[0]][move[1]].setValue(playerToken);
      //  const newHash = Hash ^ zobristTable[move[0]][move[1]][playerToken];

        // Получаем оценку из таблицы транспозиций (если есть)
        const entry = state.getRecord(state.hash)
        const score = entry && entry.depth >= depthLimit ? entry.bestScore : null;

        state.undoMove(move)
        // Откатываем ход
        //field[move[0]][move[1]].setValue(defaultSymbol);

        return { move, score };
    });

    // Сортируем ходы на основе оценок (сначала высокие для макс., низкие для мин.)
    evaluatedMoves = evaluatedMoves.sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;  // null в конец
        if (b.score === null) return -1; // null в конец
        return playerToken === "X" ? b.score - a.score : a.score - b.score;
    });

    // Возвращаем отсортированные ходы
    return evaluatedMoves.map(item => item.move);
}
