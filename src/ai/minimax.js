import { game } from "../game";
import { finalHeuristic } from "./heuristics";

const scores = {
    win: 10000,
    lose: -10000,
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
                const oppositeHash = `${hash}:${isMax ? 'min' : 'max'}`
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
        // Зависит
        let terminalState = game.checkTerminalState(lastMove[0], lastMove[1])
        switch (terminalState) {
            case "win":
                return scores.win - depth
            case "lose":
                return scores.lose + depth
            case "draw":
                return scores.draw
            default:
                break;
        }
        // Тут ошибка по моему была доаущена. Если достигнута победа, то надо сравнивать не isMax, а равен ли isMax state.isMax
        /* Точнее нет, это не важно для алгоритма минимакс. Это лишнее всё скорее всего. Надо просто давать победу
        if (terminalState === "win" || terminalState === "draw") {
            let returnVal = 0
            if (terminalState === "win") {
                terminalState = !isMax ? "win" : "lose"
            }
            if (terminalState === "win") {
                returnVal = scores[terminalState] - depth
            } else if (terminalState === "lose") {
                returnVal = scores[terminalState] + depth
            } else
                returnVal = scores[terminalState]
            return returnVal
        }*/

        // Закончить игру оценив доску статическим методов
        if (depth >= maxDepth) {
            const result = finalHeuristic(isMax ? 'X' : 'O')
            storeTransposition(state.hash, createRecord(maxDepth - depth, result, types.exact, isMax, 0))
            return result
        }

        let breakFlag = false
        let undoHashMove = null
        let bestScore = isMax ? -Infinity : Infinity
        let token = isMax ? "X" : "O"
        let entryType = types.exact
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves();
        //possibleMoves = sortMoves(possibleMoves, token, maxDepth)
        possibleMoves = sortMovesByHeuristic(possibleMoves)
        for (const move of possibleMoves) {
            // Выполнить ход
            state.applyMove(move)
            state.movesCounter++

            // Рекурсивный вызов минимакса
            const score = search(state, maxDepth, !isMax, move[0], move[1], alpha, beta, depth + 1);

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
            state.applyMove(move)
        }

        // Сохраняем в транспозиционную таблицу
        if (breakFlag) {
            //Hash ^= zobristTable[undoHashMove[0]][undoHashMove[1]][token]
            storeTransposition(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
            state.applyMove(undoHashMove)
        } else {
            storeTransposition(state.hash, createRecord(maxDepth - depth, bestScore, entryType, isMax, 0))
        }

        return bestScore
    }
    return { search }
}