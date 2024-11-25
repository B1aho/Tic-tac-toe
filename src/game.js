// Заменить на shared state
import { getSharedState } from "./sharedState.js";
const state = getSharedState()

// Size убрать
export const game = {
    createField() {
        const field = state.field
        const size = state.size
        for (let i = 0; i < size; i++) {
            field[i] = []
            for (let j = 0; j < size; j++) {
                field[i].push(this.Cell())
            }
        }
    },

    updateFieldValue(row, col, newValue) {
        const field = state.field
        field[row][col].setValue(newValue)
    },

    resetField() {
        const field = state.field
        field.forEach(el => el.forEach(cell => cell.setValue(state.defaultSymbol)))
    },

    Cell() {
        let value = state.defaultSymbol
    
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
        const field = state.field
        const token = field[rw][cl].getValue();
        let winLine = 0
        switch (field.length) {
            case 3:
                winLine = 3
                break;
            case 4:
            case 5:
            case 6:
                winLine = 4
                break;
            case 12:
                winLine = 5
                break;

        }    
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
        const size = state.field.length
        const maxMoves = Math.pow((size), 2)
        if (this.checkWin(row, col))
            return "win"
        if (state.movesCounter === maxMoves && !state.isExtended) {
            return "draw"
        }
    },

    removeMove(move) {
        state.field[move[0]][move[1]].setValue(state.defaultSymbol)
    },

    nextPlayerMove() {
        const nextPlayer = state.currentPlayer === state.players.playerX ? state.players.playerO : state.players.playerX
        state.currentPlayer = nextPlayer
    },
}
