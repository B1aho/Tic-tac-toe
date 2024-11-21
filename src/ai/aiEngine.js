import { createIterativeDeeping } from "./iterativeDeepening.js";
import { createZobristHash } from "./zobristHashing.js";
import { createTranspositionTable } from "./transpositionTable.js";
import { createMinimax } from "./minimax.js";
import { getSharedState } from "../sharedState.js";

const evaluateMaxDepth = (size) => {
    if (size === 2)
        MAX_DEPTH_ITER = 10
    else
        MAX_DEPTH_ITER = (size >= 4) ? 6 : 6
}

// Проверяем ходы до алгоритма углубления
/*
const hardMove = checkBestMoves(state.movesCounter, state.field)
if (hardMove)
    return hardMove
*/

//0, !state.isMax, move[0], move[1], -Infinity, Infinity, Hash, currDepth
export const createEngine = (config) => {
    const state = getSharedState()
    const tokenTypes = {
        x: "X",
        o: "O",
        empty: state.defaultSymbol,
    }
    const limits = {
        maxDepth: evaluateMaxDepth(state.field.length - 1),
        timeOut: config.timeOut,
    }
    const zobristHashing = createZobristHash(state.field.length, tokenTypes)
    const transpositionTable = createTranspositionTable()
    const iterativeDeepening = createIterativeDeeping(state)
    const minimax = createMinimax(transpositionTable)

    state.hash = zobristHashing.initHash(state.field)

    // Construct function that define AI move. Pass minimax-callback to iterative deepening method
    const getBestMove = (state = state) => {
        return iterativeDeepening.runSearch((state, depth, move) => {
            return minimax.search(state, depth, !state.isMax, move, Infinity, -Infinity, 0)
        }, limits)
    }

    const makeMove = () => {
        console.time("Ai move")
        const move = getBestMove(state)
        console.time("Ai move")
        state.field[move[0]][move[1]].setValue(state.currentToken)
        state.movesCounter++
    }
    return {makeMove}
}