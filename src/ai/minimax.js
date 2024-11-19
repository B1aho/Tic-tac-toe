
// Огрничить кол-во аргументов, что-то вынести в другую функцию, либо объект параметров передавать
const minimax = (depth, isMax, rw, cl, alpha, beta, hash, maxDepth) => {
    // Проверка транспозиционной таблицы
    let cached = getTransposition(hash);
    if (cached && cached.depth >= maxDepth - depth) {
        if (cached.isMax !== isMax) {
            const oppositeHash = `${hash}:${isMax ? 'min' : 'max'}`
            cached = getTransposition(oppositeHash)
        }
        if (cached) {
            cached.inUse++
            if (cached.type === "exact") {
                return cached.bestScore
            } else if (cached.type === "lowerBound" && cached.bestScore >= alpha) {// Равно попробуй поубирать потом
                alpha = cached.bestScore
            } else if (cached.type === "upperBound" && cached.bestScore <= beta) {
                beta = cached.bestScore
            }
            if (alpha >= beta) return cached.bestScore
        }
    }
    // Зависит
    let terminalState = checkEnd(rw, cl)
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
    }

    // Закончить игру оценив доску статическим методов
    if (depth >= maxDepth) {
        const result = finalHeuristic(isMax ? 'X' : 'O')
        storeTransposition(Hash, maxDepth - depth, result, "exact", isMax, 0)
        return result
    }

    let breakFlag = false
    let undoHashMove = null
    let bestScore = isMax ? -Infinity : Infinity
    let token = isMax ? players[0].token : players[1].token
    let entryType = "exact"
    // Генерация и сортировка возможных ходов
    let possibleMoves = getPossibleMoves();
    //possibleMoves = sortMoves(possibleMoves, token, maxDepth)
    possibleMoves = sortMovesByHeuristic(possibleMoves)
    for (const move of possibleMoves) {
        // Выполнить ход
        Hash ^= zobristTable[move[0]][move[1]][token]
        field[move[0]][move[1]].setValue(token)
        movesCounter++

        // Рекурсивный вызов минимакса
        const score = minimax(depth + 1, !isMax, move[0], move[1], alpha, beta, Hash, maxDepth);

        // Откатить ход
        field[move[0]][move[1]].setValue(defaultSymbol) // prevToken
        movesCounter--
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
            if (score <= alpha) entryType = "upperBound";
            else if (score >= beta) entryType = "lowerBound";
            breakFlag = true
            undoHashMove = move
            break
        }
        Hash ^= zobristTable[move[0]][move[1]][token]
    }

    // Сохраняем в транспозиционную таблицу
    if (breakFlag) {
        Hash ^= zobristTable[undoHashMove[0]][undoHashMove[1]][token]
        storeTransposition(Hash, maxDepth - depth, bestScore, entryType, isMax, 0)
    } else {
        storeTransposition(Hash, maxDepth - depth, bestScore, entryType, isMax, 0)
    }

    return bestScore
}