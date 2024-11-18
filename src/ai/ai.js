const defaultSymbol = '*'
// Инициализируем уникальные хэши для каждого состояния клетки, т.е. получаем задаем по три хэш на каждую клетку
const zobristTable = Array.from({ length: size + 1 }, () =>
    Array.from({ length: size + 1 }, () => ({
        'X': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        'O': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        '*': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    }))
)

// Получаем хэш для доски   
const getHash = (field) => {
    let hash = 0;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = field[row][col];
            if (cell.getValue() === 'X') {
                hash ^= zobristTable[row][col]["X"];
            } else if (cell.getValue() === 'O') {
                hash ^= zobristTable[row][col]["O"];
            } else {
                hash ^= zobristTable[row][col]["*"];
            }
        }
    }
    return hash;
}

let Hash = getHash()

// Транспозиционная таблица для хранения хэшей
const transpositionTable = new Map();

//@type value can be exact, upperBound or lowerBound for correct working with alpha-beta puring
const storeTransposition = (hash, depth, bestScore, type, isMax, inUse) => {
    const previousValue = transpositionTable.get(hash)
    if (typeof previousValue === "undefined") {
        // Если ранее не было сохранено, сохраняем новое состояние
        transpositionTable.set(hash, { depth, bestScore, type, isMax, inUse })
    } else {
        // Обновляем, если это более глубокая позиция для текущего состояния
        if (previousValue.isMax === isMax && previousValue.depth < depth) {
            transpositionTable.set(hash, { depth, bestScore, type, isMax, inUse })
        }
        // Если isMax отличается, нужно использовать другой хэш
        else if (previousValue.isMax !== isMax) {
            // Используем "другой хеш" для противоположного состояния
            const oppositeHash = `${hash}:${isMax ? 'min' : 'max'}` // создаём уникальный ключ для противоположных состояний
            const otherPreviousValue = transpositionTable.get(oppositeHash)
            if (!otherPreviousValue || otherPreviousValue.depth < depth) {
                transpositionTable.set(oppositeHash, { depth, bestScore, type, isMax, inUse })
            }
        }
    }
}

const getTransposition = (hash) => {
    return transpositionTable.get(hash);
}

function getPossibleMoves(field) {
    const centerRow = Math.floor(size / 2);
    const centerCol = Math.floor(size / 2);
    const moves = [];
    for (let row = 0; row <= size; row++) {
        for (let col = 0; col <= size; col++) {
            if (field[row][col].getValue() === defaultSymbol) {
                const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol)
                //const distanceFromCenter = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2))
                const centerWeight = 5 - distanceFromCenter // Чем ближе к центру, тем выше значение
                moves.push([row, col, centerWeight])
            }
        }
    }
    return moves;
}

// Оценить и отсортировать ходы по их выгодности
function sortMovesByHeuristic(moves) {
    return moves.sort((a, b) => b[2] - a[2]);
}

function sortMoves(possibleMoves, playerToken, depthLimit) {
    // Создаем массив с оценками ходов
    let evaluatedMoves = possibleMoves.map(move => {
        // Применяем ход
        field[move[0]][move[1]].setValue(playerToken);
        const newHash = Hash ^ zobristTable[move[0]][move[1]][playerToken];

        // Получаем оценку из таблицы транспозиций (если есть)
        const entry = transpositionTable.get(newHash);
        const score = entry && entry.depth >= depthLimit ? entry.bestScore : null;

        // Откатываем ход
        field[move[0]][move[1]].setValue(defaultSymbol);

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

const better = (a, b, isMax) => {
    if (isMax) {
        return a > b
    } else
        return a < b
}

const MAX_TIME = 6000

const checkBestMoves = () => {
    if (size === 4) {
        if (movesCounter === 0 || movesCounter === 1 && field[2][2].getValue() === defaultSymbol) {
            let move = bestAiMoves.firstIn5
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move
        } else if (movesCounter === 1) {
            let move = bestAiMoves.secondIn5
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move

        }
    } // Прописать первый ходы за нолики в центр, но если в центре есть соперник то по диагонали к нему. Потом вынести в отдел функцию
    else if (size === 5) {
        if (movesCounter === 1) {
            let leftTop = field[2][2]
            let rightTop = field[2][3]
            let leftBottom = field[3][2]
            let rightBottom = field[3][3]
            if (leftTop.getValue() !== defaultSymbol) {
                rightBottom.setValue(players[idx].token)
                Hash ^= zobristTable[3][3][players[idx].token]
                return [3, 3]
            } else if (rightTop.getValue() !== defaultSymbol) {
                leftBottom.setValue(players[idx].token)
                Hash ^= zobristTable[3][2][players[idx].token]
                return [3, 2]
            } else if (leftBottom.getValue() !== defaultSymbol) {
                rightTop.setValue(players[idx].token)
                Hash ^= zobristTable[2][3][players[idx].token]
                return [2, 3]
            } else if (rightBottom.getValue() !== defaultSymbol) {
                leftTop.setValue(players[idx].token)
                Hash ^= zobristTable[2][2][players[idx].token]
                return [2, 2]
            } else {
                let move = bestAiMoves.firstIn6
                field[move[0]][move[1]].setValue(players[idx].token)
                Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
                return move
            }
        } else if (movesCounter === 0) {
            let move = bestAiMoves.firstIn6
            field[move[0]][move[1]].setValue(players[idx].token)
            Hash ^= zobristTable[move[0]][move[1]][players[idx].token]
            return move
        }
    }
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

const finalHeuristic = (player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    const opponentScore = heuristic(opponent)
    return opponentScore
}

const evaluateRow = (row, length, player, opponent) => {
    let score = 0
    for (let startCol = 0; startCol <= field[row].length - length; startCol++) {
        const line = field[row].slice(startCol, startCol + length)
        score += evaluateLine(line, player, opponent)
    }
    return score
}

const evaluateColumn = (col, length, player, opponent) => {
    let score = 0
    for (let startRow = 0; startRow <= size + 1 - length; startRow++) {
        const line = []
        for (let i = 0; i < length; i++) {
            line.push(field[startRow + i][col])
        }
        score += evaluateLine(line, player, opponent)
    }
    return score
}

const evaluateDiagonals = (length, player, opponent) => {
    let score = 0

    // Левая диагональ
    for (let startRow = 0; startRow <= size - length + 1; startRow++) {
        for (let startCol = 0; startCol <= field[startRow].length - length; startCol++) {
            const line = []
            for (let i = 0; i < length; i++) {
                line.push(field[startRow + i][startCol + i])
            }
            score += evaluateLine(line, player, opponent)
        }
    }

    // Правая диагональ
    for (let startRow = 0; startRow <= size - length + 1; startRow++) {
        for (let startCol = length - 1; startCol < field[startRow].length; startCol++) {
            const line = []
            for (let i = 0; i < length; i++) {
                line.push(field[startRow + i][startCol - i])
            }
            score += evaluateLine(line, player, opponent)
        }
    }
    return score
}

const heuristic = (player) => {
    const opponent = player === 'X' ? 'O' : 'X'
    let score = 0
    const length = size > 2 ? 4 : 3

    // Оценка строк
    for (let row = 0; row <= size; row++) {
        score += evaluateRow(row, length, player, opponent)
    }

    // Оценка столбцов
    for (let col = 0; col <= size; col++) {
        score += evaluateColumn(col, length, player, opponent)
    }

    // Оценка диагоналей
    score += evaluateDiagonals(length, player, opponent)
    return score
}

const evaluateLine = (line, player, opponent) => {
    let playerCount = 0
    let opponentExists = false;

    for (const cell of line) {
        const cellValue = cell.getValue();
        if (cellValue === player) {
            playerCount++
        } else if (cellValue === opponent) {
            if (player === 'O') playerCount--
            else {
                opponentExists = true;
                break;
            }

        }
    }

    // Если в линии есть метка оппонента, возвращаем 0
    if (opponentExists) {
        return 0;
    }

    // Возвращаем квадрат количества меток игрока
    return playerCount ** 2;
};

const scores = {
    win: 10000,
    lose: -10000,
    draw: 0,
}

// Захардкодить лучшие ходы для разных ситуаций, лучше объект, где свойства своим именем поисывают ситуацию для хода
const bestAiMoves = {
    firstIn5: [2, 2],
    secondIn5: [1, 1],
    firstIn6: [2, 2],
    secondIn6: [2, 3],
}

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