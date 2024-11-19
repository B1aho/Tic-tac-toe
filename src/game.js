let movesCounter = 0
const defaultSymbol = '*'

export const game = {
    field: [],
    currentPlayer: null,
    size: 0,
    createField() {
        for (let i = 0; i < this.size; i++) {
            this.field[i] = []
            for (let j = 0; j < this.size; j++) {
                this.field[i].push(this.Cell())
            }
        }
    },

    initialize(size, player) {
        this.size = size
        this.currentPlayer = player
    },

    getDeafultSymbol () {
        return defaultSymbol
    },

    updateFieldValue(row, col, newValue) {
        this.field[row][col].setValue(newValue)
    },

    back() {
        this.field = []
        movesCounter = 0
        this.currentPlayer = null
        this.size = 0
    },

    reset(playerX) {
        this.field.forEach(el => el.forEach(cell => cell.setValue(defaultSymbol)))
        movesCounter = 0
        this.currentPlayer = playerX
    },

    Cell() {
        let value = defaultSymbol
    
        const getValue = () => {
            return value;
        }
        
        const setValue = (newVal) => {
            value = newVal
        }
    
        return {
            getValue,
            setValue,
        }
    },

    checkWin (rw, cl) {
        const field = this.field
        const token = field[rw][cl].getValue();
        const winLine = field.length > 3 ? 4 : 3;
    
        // General function to check consecutive tokens
        const countConsecutive = (getCellValue) => {
            let count = 0;
            for (let value of getCellValue()) {
                if (value === token) {
                    count++;
                    if (count >= winLine) return true;
                } else {
                    count = 0;
                }
            }
            return false;
        };
    
        // Check row
        if (countConsecutive(() => field[rw].map(cell => cell.getValue()))) {
            return true;
        }
    
        // Check column
        if (countConsecutive(() => field.map(row => row[cl].getValue()))) {
            return true;
        }
    
        // Check main diagonal
        if (
            countConsecutive(() => {
                const result = [];
                let i = rw, j = cl;
                while (i > 0 && j > 0) {
                    i--;
                    j--;
                }
                while (i < field.length && j < field.length) {
                    result.push(field[i][j].getValue());
                    i++;
                    j++;
                }
                return result;
            })
        ) {
            return true;
        }
    
        // Check secondary diagonal
        if (
            countConsecutive(() => {
                const result = [];
                let i = rw, j = cl;
                // Идём к началу побочной диагонали
                while (i < field.length - 1 && j > 0) {
                    i++;
                    j--;
                }
                // Собираем значения на диагонали
                while (i >= 0 && j < field.length) {
                    result.push(field[i][j].getValue());
                    i--;
                    j++;
                }
                return result;
            })
        ) {
            return true;
        }
    
        // No win
        return false;
    },

    checkTerminalState (row, col) {
        const maxMoves = Math.pow((this.size), 2)
        if (movesCounter === maxMoves) {
            return "draw"
        }
        if (this.checkWin(row, col))
            return "win"
    },

    nextPlayerMove(nextPlayer) {
        this.currentPlayer = nextPlayer
        movesCounter++ 
    },
}
/*
// Добавить всю эту логику в наш объект
// Подумать как красиво добавить ИИ

// Выбираем стратегию для компьютера в алгоритме minmax, а также блокируем клик на первый ход, если компьютер крестик
let aiStrategy
let aiIdx

const makeAiMove = () => {
    gameActiveState = false
    console.time("Ai move")
    const aiCoords = game.moveAi(aiIdx, aiStrategy === "max" ? true : false)
    console.timeEnd("Ai move")
    renderAiMove(aiCoords)
    console.log(BenchCount)
    BenchCount = 0
    const result = game.checkEnd(aiCoords[0], aiCoords[1])
    game.turnMove()
    controlMove(result)
    gameActiveState = result === "win" || result === "draw" ? false : true
}

if (firstPlayerName === "AI" || secondPlayerName === "AI") {
    aiStrategy = firstPlayerName === "AI" ? "max" : "min"
    aiIdx = aiStrategy === "max" ? 0 : 1
    if (aiStrategy === "max") {
        makeAiMove()
    }
}
    */