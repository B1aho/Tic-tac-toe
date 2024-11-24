// Тоже можно как-то в общее состояние движка закинуть и прописать, чтобы убирал последний ход, а не искал свободные заново
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

export const isBetterMove = (a, b, isMax) => {
    if (isMax) {
        return a > b
    } else
        return a < b
}