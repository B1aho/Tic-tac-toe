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
                    return cached.bestScore
                } else if (cached.type === types.lower && cached.bestScore >= alpha) {
                    alpha = cached.bestScore
                } else if (cached.type === types.upper && cached.bestScore <= beta) {
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
                return scores.winO + depth
            case "draw":
                return scores.draw
            default:
                break;
        }

        // Закончить игру оценив доску статическим методов
        if (depth >= maxDepth) {
            const result = finalHeuristic(state.field, isMax ? 'X' : 'O')
            state.storeRecord(state.hash, createRecord(maxDepth - depth, result, types.exact, isMax, 0))
            return result
        }

        let breakFlag = false
        let undoHashMove = null
        let bestScore = isMax ? -Infinity : Infinity
        let token = isMax ? "X" : "O"
        let entryType = types.exact
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves(state.field);
        //possibleMoves = sortMoves(possibleMoves, token, maxDepth)
        possibleMoves = sortMovesByHeuristic(possibleMoves)
        for (const move of possibleMoves) {
            // Выполнить ход
            state.applyMove(move, token)
            state.movesCounter++

            // Рекурсивный вызов минимакса
            const score = search(state, maxDepth, !isMax, move, alpha, beta, depth + 1);

            // Откатить ход
            //field[move[0]][move[1]].setValue(defaultSymbol) // prevToken
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
            //Hash ^= zobristTable[move[0]][move[1]][token]
            state.undoMove(move)
        }

        // Сохраняем в транспозиционную таблицу
        if (breakFlag) {
            //Hash ^= zobristTable[undoHashMove[0]][undoHashMove[1]][token]
            state.undoMove(undoHashMove)
            state.storeRecord(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
           // state.undoMove(undoHashMove)
        } else {
            state.storeRecord(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
        }

        return bestScore
    }
    return { search }
}