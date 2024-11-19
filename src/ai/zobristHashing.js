// Инициализируем уникальные хэши для каждого состояния клетки, т.е. получаем задаем по три уникальных хэша на каждую клетку
export const createZobristHash = (size, tokenTypes) => {
    const zobristTable = Array.from({ length: size + 1 }, () =>
        Array.from({ length: size + 1 }, () => ({
            [tokenTypes.x]: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            [tokenTypes.o]: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            [tokenTypes.empty]: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        })));

    const initHash = (field) => {
        let hash = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cellValue = field[row][col].getValue();
                hash ^= zobristTable[row][col][cellValue]
            }
        }
        return hash
    };

    // Поменять position на объект
    const updateHash = (oldHash, position, token) => {
        return oldHash ^= zobristTable[position[0]][position[1]][token]
    }
    return {
        initHash,
        updateHash,
    }
};
