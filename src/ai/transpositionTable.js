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