// Отдельное поле для ИИ 
const sharedState = {
    players: {
        playerX: {
            name: null,
            token: null,
        },
        playerO: {
            name: null,
            token: null,
        },
    },
    size: 0,
    currentPlayer: null,
    hash: null,
    isMax: true,
    field: [],
    movesCounter: 0,
    defaultSymbol: "*",
    zobristTable: null,
    gameStatus: null,
    countStoreCash: 0,
    countGetCash: 0,

    initialize(options) {
        this.size = options.size

        this.players.playerX.name = options.player1.name,
        this.players.playerX.token = options.player1.token,
        this.players.playerO.name = options.player2.name,
        this.players.playerO.token = options.player2.token,
      
        this.currentPlayer = this.players.playerX
    },

    back() {
        this.field = []
        this.movesCounter = 0
        this.currentPlayer = null
        this.gameStatus = null
        this.size = 0
    },

    reset() {
        this.movesCounter = 0
        this.gameStatus = null
        this.currentPlayer = this.players.playerX
    },

    // насколько это должно быть shared?
    applyMove(move, token) {
        this.field[move[0]][move[1]].setValue(token)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    },
    undoMove(move, token) {
        this.field[move[0]][move[1]].setValue(this.defaultSymbol)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    },

    reset() {

    },

    back() {

    },
}

export const getSharedState = () => sharedState