const defaultSymbol = '*'
// Инициализируем уникальные хэши для каждого состояния клетки, т.е. получаем задаем по три хэш на каждую клетку
const zobristTable = Array.from({ length: size + 1 }, () =>
    Array.from({ length: size + 1 }, () => ({
        'X': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        'O': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        defaultSymbol: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
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