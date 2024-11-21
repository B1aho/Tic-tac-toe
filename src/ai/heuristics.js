export const finalHeuristic = (player) => {
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