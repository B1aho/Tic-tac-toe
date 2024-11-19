export const createTranspositionTable = () => {
    // Транспозиционная таблица для хранения потенциально повторяющихся конфигураций на поле (от того и название транспозиция - позиция, которая)
    const transpositionTable = new Map();

    //@type value can be exact, upperBound or lowerBound for correct working with alpha-beta puring
    const storeRecord = (hash, record) => {
        const previousRecord = transpositionTable.get(hash)
        const {depth, bestScore, type, isMax, inUse} = record

        // Если ранее конфигурация не была сохранена, то сохраняем её
        if (typeof previousRecord === "undefined") {
            transpositionTable.set(hash, { depth, bestScore, type, isMax, inUse })
        } else {
            // Если конфигурация глубже уже сохраненной и была сделана с той же ролью, то перезаписываем
            if (previousRecord.isMax === isMax && previousRecord.depth < depth) {
                transpositionTable.set(hash, { depth, bestScore, type, isMax, inUse })
            }
            // Если роль отличается, то
            else if (previousRecord.isMax !== isMax) {
                // Используем "другой хеш" для для записи конфигурации противоположной роли
                const oppositeHash = `${hash}:${isMax ? 'min' : 'max'}` 
                const otherPreviousRecord = transpositionTable.get(oppositeHash)
                // Если не было такой конфигурации с противоположной ролью или была но с меньшей глубиной, тогда перезаписываем 
                if (!otherPreviousRecord || otherPreviousRecord.depth < depth) {
                    transpositionTable.set(oppositeHash, { depth, bestScore, type, isMax, inUse })
                }
            }
        }
    };

    const getRecord = (hash) => {
        return transpositionTable.get(hash);
    };

    return {
        getRecord,
        storeRecord,
    }
}
