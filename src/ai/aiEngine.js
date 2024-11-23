import { createIterativeDeeping } from "./iterativeDeepening.js";
import { createZobristHash } from "./zobristHashing.js";
import { createTranspositionTable } from "./transpositionTable.js";
import { createMinimax } from "./minimax.js";
import { getSharedState } from "../sharedState.js";

const evaluateMaxDepth = (size) => {
    return Math.pow(size, 2)
 /*   if (size === 2)
        return 10
    else
        return (size > 4) ? 6 : 6*/
}

// Проверяем ходы до алгоритма углубления
/*
const hardMove = checkBestMoves(state.movesCounter, state.field)
if (hardMove)
    return hardMove
*/

export const createEngine = (config) => {
    const state = getSharedState()
    const tokenTypes = {
        x: "X",
        o: "O",
        empty: state.defaultSymbol,
    }
    const limits = {
        maxDepth: evaluateMaxDepth(state.field.length),
        timeOut: config.timeOut,
    }
    const zobristHashing = createZobristHash(state.field.length, tokenTypes)
    const transpositionTable = createTranspositionTable()
    state.getRecord = transpositionTable.getRecord
    state.zobristTable = zobristHashing.zobristTable
    const iterativeDeepening = createIterativeDeeping(state)
    const minimax = createMinimax(transpositionTable)

    state.hash = zobristHashing.initHash(state.field)
    state.storeRecord = transpositionTable.storeRecord

    // Construct function that define AI move. Pass minimax-callback to iterative deepening method
    const makeBestMove = (state = state) => {
        return iterativeDeepening.runSearch((state, depth, move) => {
            return minimax.search(state, depth, !state.isMax, move, -Infinity, Infinity, 0)
        }, limits)
    }

    const reset = () => {
        state.hash = zobristHashing.initHash(state.field)
        limits.maxDepth = evaluateMaxDepth(state.field.length)
        transpositionTable.clear()
    }
    return {makeBestMove, reset}
}