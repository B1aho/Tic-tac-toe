import { createZobristHash } from "./zobristHashing" 
const sharedState = {
    currentToken: "X", // Нужно его обновлять каждый раз, наверно в applyMoves
    hash: null,
    isMax: true,
    field: null,
    movesCounter: 0,
    defaultSymbol: "*",

    applyMove(move) {
        this.field[move[0]][move[1]].setValue(this.currentToken)
        this.hash ^= zobristTable[move[0]][move[1]][this.currentToken]
    },
}

export const getSharedState = () => sharedState