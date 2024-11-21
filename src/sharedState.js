const sharedState = {
    currentPlayer: null, // Нужно его обновлять каждый раз, наверно в applyMoves
    hash: null,
    isMax: true,
    field: [],
    movesCounter: 0,
    defaultSymbol: "*",

    applyMove(move) {
        this.field[move[0]][move[1]].setValue(this.currentPlayer.token)
        this.hash ^= zobristTable[move[0]][move[1]][this.currentPlayer.token]
    },
}

export const getSharedState = () => sharedState