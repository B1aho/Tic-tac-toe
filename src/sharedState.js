// Отдельное поле для ИИ
const sharedState = {
    currentPlayer: null, // Нужно его обновлять каждый раз, наверно в applyMoves
    hash: null,
    isMax: true,
    field: [],
    movesCounter: 0,
    defaultSymbol: "*",
    zobristTable: null,
    countStoreCash: 0,
    countGetCash: 0,

    // насколько это должно быть shared?
    applyMove(move, token) {
        this.field[move[0]][move[1]].setValue(token)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    },
    undoMove(move, token) {
        this.field[move[0]][move[1]].setValue(this.defaultSymbol)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    },
}

export const getSharedState = () => sharedState