import { createIterativeDeeping } from "./iterativeDeepening.js";
import { createZobristHash } from "./zobristHashing.js";
import { createTranspositionTable } from "./transpositionTable.js";
import { createMinimax } from "./minimax.js";
import { getFreeMoves } from "./moveHelpers.js";

const aiLevels = {
    first: "Dumb",
    second: "Medium",
    third: "My champ",
}

const evaluateMaxDepth = (size, ailvl) => {
    if (ailvl === aiLevels.second) {
        return size > 3 ? 3 : 4
    }
    return size > 3 ? 3 : 10
}

export const createEngine = (state) => {
    const tokenTypes = {
        x: "X",
        o: "O",
        empty: state.defaultSymbol,
    }
    const limits = {
        maxDepth: evaluateMaxDepth(state.field.length, state.aiLevels),
        timeOut: 6000,
    }
    const zobristHashing = createZobristHash(state.size, tokenTypes)
    const transpositionTable = createTranspositionTable()
    state.getRecord = transpositionTable.getRecord
    state.zobristTable = zobristHashing.zobristTable
    const iterativeDeepening = createIterativeDeeping(state)
    const minimax = createMinimax(transpositionTable)

    state.hash = zobristHashing.initHash(state.field)
    state.storeRecord = transpositionTable.storeRecord

    // Здесь создаем функцию makeBestMove в зависимости от уровня ИИ
    let makeBestMove = null
    // Construct function that define AI move. Pass minimax-callback to iterative deepening method
    if (state.aiLevels === aiLevels.second || state.aiLevels === aiLevels.third) {
        makeBestMove = (state = state) => {
            return iterativeDeepening.runSearch((state, depth, move) => {
                return minimax.search(state, depth, !state.isMax, move, -Infinity, Infinity, 0)
            }, limits)
        }
    } else {
        makeBestMove = (state) => {
            const moves = getFreeMoves(state.field)
            const randomMove = Math.floor(Math.random() * moves.length)
            return moves[randomMove]
        }
    }

    const reset = () => {
        state.hash = zobristHashing.initHash(state.field)
        limits.maxDepth = evaluateMaxDepth(state.field.length, state.aiLevels)
        transpositionTable.clear()
    }
    return { makeBestMove, reset }
}