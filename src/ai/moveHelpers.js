export function getPossibleMoves(field) {
    let size = field.length - 1
    const centerRow = Math.floor(size / 2)
    const centerCol = Math.floor(size / 2)
    const moves = [];
    for (let row = 0; row <= size; row++) {
        for (let col = 0; col <= size; col++) {
            // Звездочку убрать отсюда
            if (field[row][col].getValue() === "*") {
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
export function sortMovesByHeuristic(moves) {
    return moves.sort((a, b) => b[2] - a[2]);
}

export function sortMoves(field, possibleMoves, playerToken, depthLimit) {
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

export const isBetterMove = (a, b, isMax) => {
    if (isMax) {
        return a > b
    } else
        return a < b
}