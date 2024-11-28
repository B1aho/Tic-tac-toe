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
    isExtended: false,
    isInMinimax: false,
    countStoreCash: 0,
    countGetCash: 0,

    initialize(options) {
        this.size = options.size
        this.isMax = Number(options.playersNumber) === 1 ? true : false
        this.players.playerX.name = options.player1.name,
        this.players.playerX.token = options.player1.token,
        this.players.playerO.name = options.player2.name,
        this.players.playerO.token = options.player2.token,
        this.isExtended = options.isExtended === "true" ? true : false
        this.currentPlayer = this.players.playerX
        if (options.aiLevels) {
            this.aiLevels = options.aiLevels
        }
    },

    back() {
        this.field = []
        this.movesCounter = 0
        this.currentPlayer = null
        this.gameStatus = null
        this.size = 0
        if (this.isExtended) {
            delete this.currentMoves
            delete this.updateMovesQueue
            delete this.winLength
        }
    },

    reset() {
        this.movesCounter = 0
        this.gameStatus = null
        this.currentPlayer = this.players.playerX
        if (this.isExtended) {
            this.currentMoves.X = []
            this.currentMoves.O = []
        }
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

    applyExtendedMove(move, token) {
        const lastMove = this.updateMovesQueue(move, token)
        // Если это расширенный ход, то убираем лишний ход из хэша
        if (lastMove !== null) {
            this.hash ^= this.zobristTable[lastMove[0]][lastMove[1]][token]
        }
        // hash по другому считается по мимо новой клетки старая в дефолт
        this.field[move[0]][move[1]].setValue(token)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
        return lastMove
    },

    undoExtendedMove(move, token, lastMove) {
        // Применяем стертый ход, если он был
        if (lastMove) {
            this.field[lastMove[0]][lastMove[1]].setValue(token)
            this.hash ^= this.zobristTable[lastMove[0]][lastMove[1]][token]
            this.currentMoves[token].unshift(lastMove)
        }
        this.field[move[0]][move[1]].setValue(this.defaultSymbol)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
        this.currentMoves[token].pop()
    },

}

export const getSharedState = () => sharedState