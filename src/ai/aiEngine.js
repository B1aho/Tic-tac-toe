import { createIterativeDeeping } from "./iterativeDeepening";
import { createZobristHash } from "./zobristHashing";
import { createTranspositionTable } from "./transpositionTable";
import { createMinimax } from "./minimax";
import { getSharedState } from "./sharedState";

const MAX_TIME = 6000

let MAX_DEPTH_ITER = 0
const evaluateMaxDepth = (size) => {
    if (size === 2)
        MAX_DEPTH_ITER = 10
    else
        MAX_DEPTH_ITER = (size >= 4) ? 6 : 6
}
// Тоже в state будет метод
const applyMove = (move) => {
    this.field[move[0]][move[1]].setValue(players[idx].token)
    this.hash ^= zobristTable[move[0]][move[1]][players[idx].token]
}

// Проверяем ходы до алгоритма углубления
const hardMove = checkBestMoves(state.movesCounter, state.field)
if (hardMove)
    return hardMove

0, !state.isMax, move[0], move[1], -Infinity, Infinity, Hash, currDepth
export const createEngine = (config) => {
    const state = getSharedState()
    const tokenTypes = {
        x: "X",
        o: "O",
        empty: state.defaultSymbol,
    }
    const zobristHashing = createZobristHash(state.field.length, tokenTypes)
    const transpositionTable = createTranspositionTable()
    const iterativeDeepening = createIterativeDeeping(state)
    const minimax = createMinimax(transpositionTable)
    const getBestMove = (state) => {

    }
    return {}
}