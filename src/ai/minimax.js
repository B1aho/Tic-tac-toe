import { game } from "../game.js";

import { finalHeuristic } from "./heuristics.js";
import { getPossibleMoves, sortMovesByHeuristic } from "./moveHelpers.js";

const scores = {
    winX: 10000,
    winO: -10000,
    draw: 0,
};

const types = {
    exact: "exact",
    upper: "upperBound",
    lower: "lowerBound",
};

const createRecord = (depthDelta, score, type, isMax, inUse) => {
    return {
        depth: depthDelta,
        bestScore: score,
        type: type,
        isMax: isMax,
        inUse: inUse,
    }
}

export const createMinimax = (transpositionTable) => {
    // Огрничить кол-во аргументов, что-то вынести в другую функцию, либо объект параметров передавать
    const search = (state, maxDepth, isMax, lastMove, alpha, beta, depth) => {
        // Проверка транспозиционной таблицы
        let cached = transpositionTable.getRecord(state.hash);
        if (cached && cached.depth >= maxDepth - depth) {
            if (cached.isMax !== isMax) {
                const oppositeHash = `${state.hash}:${isMax ? 'min' : 'max'}`
                cached = transpositionTable.getRecord(oppositeHash)
            }
            if (cached) {
                cached.inUse++
                if (cached.type === types.exact) {
                    state.countGetCash++
                    return cached.bestScore
                } else if (cached.type === types.lower && cached.bestScore >= alpha) {
                    state.countGetCash++
                    alpha = cached.bestScore
                } else if (cached.type === types.upper && cached.bestScore <= beta) {
                    state.countGetCash++
                    beta = cached.bestScore
                }
                if (alpha >= beta) return cached.bestScore
            }
        }
        // Здесь вместо undefined, отдавать что-то осознанное, "continue" или null
        let terminalState = game.checkTerminalState(lastMove[0], lastMove[1])
        // Проверяем какой игрок выиграл, максимимзирующий или минимизирующий
        if (terminalState === "win") {
            terminalState = !isMax ? "winX" : "winO"
        }
        switch (terminalState) {
            case "winX":
                return scores.winX - depth
            case "winO":
                return scores.winO - depth // + depth
            case "draw":
                return scores.draw
            default:
                break;
        }

        // Закончить игру оценив доску статическим методов
        if (depth >= maxDepth) {
            const result = finalHeuristic(state.field, isMax ? 'X' : 'O')
            state.storeRecord(state.hash, createRecord(maxDepth - depth, result, types.exact, isMax, 0))
            state.countStoreCash++
            return result
        }

        let breakFlag = false
        let undoHashMove = null
        let bestScore = isMax ? -Infinity : Infinity
        let token = isMax ? "X" : "O"
        let entryType = types.exact
        let lastExtendedMove = null
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves(state.field);
        // possibleMoves = sortMoves(possibleMoves, token, maxDepth)
        possibleMoves = sortMovesByHeuristic(possibleMoves)
        for (const move of possibleMoves) {
            // Выполнить ход
         //   console.log("Hash before apply: " + state.hash)
            if (state.isExtended)
                lastExtendedMove = state.applyExtendedMove(move, token) 
            else 
                state.applyMove(move, token)
         //   console.log("Hash after apply: " + state.hash)
            state.movesCounter++

            // Рекурсивный вызов минимакса
            const score = search(state, maxDepth, !isMax, move, alpha, beta, depth + 1);

            state.movesCounter--
            // Обновить лучший счёт
            if (isMax) {
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
            } else {
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
            }

            // Альфа-бета отсечение
            if (beta <= alpha) {
                // Определяем тип записи для текущей позиции перед её сохранением
                if (score <= alpha) entryType = types.upper
                else if (score >= beta) entryType = types.lower

                breakFlag = true
                undoHashMove = move
                break
            }
            if (state.isExtended) 
                state.undoExtendedMove(move, token, lastExtendedMove)
            else
                state.undoMove(move, token)
    //        console.log("Hash after undo: " + state.hash)
        }

        // Сохраняем в транспозиционную таблицу
        if (breakFlag) {
            if (state.isExtended) 
                state.undoExtendedMove(undoHashMove, token, lastExtendedMove)
            else
                state.undoMove(undoHashMove, token)
           // console.log("Hash after undo: " + state.hash)
            state.storeRecord(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
            state.countStoreCash++
           // state.undoMove(undoHashMove)
        } else {
            state.storeRecord(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
            state.countStoreCash++

        }

        return bestScore
    }
    return { search }
}