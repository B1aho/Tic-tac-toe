export const finalHeuristic = (field, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    const opponentScore = heuristic(field, opponent)
    //const playScore = heuristic(field, player)
    return opponentScore
}

const evaluateRow = (field, row, length, player, opponent) => {
    let score = 0
    for (let startCol = 0; startCol <= field[row].length - length; startCol++) {
        const line = field[row].slice(startCol, startCol + length)
        score += evaluateLine(line, player, opponent)
    }
    return score
}

const evaluateColumn = (field, col, length, player, opponent) => {
    let score = 0
    for (let startRow = 0; startRow <= field.length - length; startRow++) {
        const line = []
        for (let i = 0; i < length; i++) {
            line.push(field[startRow + i][col])
        }
        score += evaluateLine(line, player, opponent)
    }
    return score
}

const evaluateDiagonals = (field, length, player, opponent) => {
    let score = 0

    // Левая диагональ
    for (let startRow = 0; startRow <= field.length - length; startRow++) {
        for (let startCol = 0; startCol <= field[startRow].length - length; startCol++) {
            const line = []
            for (let i = 0; i < length; i++) {
                line.push(field[startRow + i][startCol + i])
            }
            score += evaluateLine(line, player, opponent)
        }
    }

    // Правая диагональ
    for (let startRow = 0; startRow <= field.length - length; startRow++) {
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

// В state вынести winLength
const heuristic = (field, player) => {
    const opponent = player === 'X' ? 'O' : 'X'
    let score = 0
    const size = field.length
    let length = 0
    switch (size) {
        case 3:
            length = 3
            break;
        case 4:
        case 5:
        case 6:
            length = 4
            break;
        case 12:
            length = 5
            break;
    } 

    // Оценка строк
    for (let row = 0; row < size; row++) {
        score += evaluateRow(field, row, length, player, opponent)
    }

    // Оценка столбцов
    for (let col = 0; col < size; col++) {
        score += evaluateColumn(field, col, length, player, opponent)
    }

    // Оценка диагоналей
    score += evaluateDiagonals(field, length, player, opponent)
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