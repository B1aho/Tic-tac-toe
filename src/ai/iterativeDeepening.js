import { getSharedState } from "../sharedState.js";

import { getPossibleMoves, sortMovesByHeuristic, isBetterMove } from "./moveHelpers.js";

// Добавить флаг максимальной глубины!, иначе по сто раз смотрит терминалньую стади, если время не стоит ограничени
export const createIterativeDeeping = (state) => {
    const runSearch = (search, limits) => {
        state.field = getSharedState().field
        limits.maxDepth++
        let bestScore = state.isMax ? -Infinity : Infinity
        let bestMove = null
        let breakFlag = false
        let lastExtendedMove = null
        const token = state.isMax ? "X" : "O"
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves(state.field);
        if (state.field.length >= 4) {
            possibleMoves = sortMovesByHeuristic(possibleMoves)
        }
        let startTime = Date.now()
        //
        for (let currDepth = state.field.length < 4 ? 1 : 3; currDepth <= limits.maxDepth; currDepth++) {
            // possibleMoves = sortMoves(possibleMoves, state.isMax ? "X" : "O", currDepth - 1)
            for (const move of possibleMoves) {
                // Выполнить ход
                // Добавить флаг undo, чтобы понимать, когда счетчик ходов увеличиваем, а когда уменьшаем
          //      console.log("Hash before apply: " + state.hash)
                if (state.isExtended) 
                    lastExtendedMove = state.applyExtendedMove(move, token) 
                else
                    state.applyMove(move, token)
       //         console.log("Hash after apply: " + state.hash)
                state.movesCounter++
                // Вызов рекурсивного минимакса с альфа-бета отсечением
                state.isInMinimax = true
                const score = search(state, currDepth, move)
                state.isInMinimax = false
                // Откатить ход
                if (state.isExtended) 
                    state.undoExtendedMove(move, token, lastExtendedMove)
                else
                    state.undoMove(move, token)
                // console.log("Hash after undo: " + state.hash)
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
            possibleMoves = sortMoves(possibleMoves, token, currDepth - 1, state)
        }
        if (state.isExtended) 
           state.applyExtendedMove(bestMove, token)
        else
            state.applyMove(bestMove, token)
        console.log("Итеративное углубление вернуло ход:" + bestMove)
        return bestMove
    }
    return { runSearch }
}


function sortMoves(possibleMoves, token, depthLimit, state) {
    let lastExtendedMove = null
    // Создаем массив с оценками ходов
    let evaluatedMoves = possibleMoves.map(move => {
        // Применяем ход
        if (state.isExtended) 
            lastExtendedMove = state.applyExtendedMove(move, token) 
        else
            state.applyMove(move, token)
       // field[move[0]][move[1]].setValue(playerToken);
      //  const newHash = Hash ^ zobristTable[move[0]][move[1]][playerToken];

        // Получаем оценку из таблицы транспозиций (если есть)
        const entry = state.getRecord(state.hash)
        const score = entry && entry.depth >= depthLimit ? entry.bestScore : null;

        if (state.isExtended) 
            state.undoExtendedMove(move, token, lastExtendedMove)
        else
            state.undoMove(move, token)
        // Откатываем ход
        // field[move[0]][move[1]].setValue(defaultSymbol);

        return { move, score };
    });

    // Сортируем ходы на основе оценок (сначала высокие для макс., низкие для мин.)
    evaluatedMoves = evaluatedMoves.sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;  // null в конец
        if (b.score === null) return -1; // null в конец
        return token === "X" ? b.score - a.score : a.score - b.score;
    });

    // Возвращаем отсортированные ходы
    return evaluatedMoves.map(item => item.move);
}
