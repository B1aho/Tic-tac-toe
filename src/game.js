// Заменить на shared state
import { getSharedState } from "./sharedState.js";

const state = getSharedState()

export class Cell {
    constructor(value = "*") {
        this.value = value
    }


    getValue() {
        return this.value
    }

    setValue(newVal) {
        this.value = newVal
    }
}

// Size убрать
export const game = {
    createField() {
        const field = state.field
        const size = state.size
        for (let i = 0; i < size; i++) {
            field[i] = []
            for (let j = 0; j < size; j++) {
                field[i].push(new Cell())
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

    checkWin(rw, cl, field) {
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
        // Общая функция для поиска координат выигрышной линии
        const findWinningCoordinates = (getCoordinates) => {
            const coords = getCoordinates()
            const consecutive = []
            for (const [row, col] of coords) {
                if (field[row][col].getValue() === token) {
                    consecutive.push([row, col])
                    if (consecutive.length >= winLine) {
                        return consecutive // Победа
                    }
                } else {
                    consecutive.length = 0 // Сброс при разрыве линии
                }
            }
            return null // Нет победы
        };

        // Проверка по строке
        const rowWin = findWinningCoordinates(() =>
            field[rw].map((_, col) => [rw, col])
        )
        if (rowWin) return rowWin

        // Проверка по колонке
        const colWin = findWinningCoordinates(() =>
            field.map((_, row) => [row, cl])
        )
        if (colWin) return colWin

        // Проверка основной диагонали
        const mainDiagWin = findWinningCoordinates(() => {
            const coords = []
            let i = rw, j = cl
            while (i > 0 && j > 0) {
                i--
                j--
            }
            while (i < field.length && j < field.length) {
                coords.push([i, j])
                i++
                j++
            }
            return coords;
        })
        if (mainDiagWin) return mainDiagWin

        // Проверка побочной диагонали
        const secondaryDiagWin = findWinningCoordinates(() => {
            const coords = [];
            let i = rw, j = cl;
            while (i < field.length - 1 && j > 0) {
                i++;
                j--;
            }
            while (i >= 0 && j < field.length) {
                coords.push([i, j]);
                i--;
                j++;
            }
            return coords
        });
        if (secondaryDiagWin) return secondaryDiagWin

        // Победы нет
        return null
    },

    checkTerminalState(row, col, field) {
        const size = state.field.length
        const maxMoves = Math.pow((size), 2)
        const resultMoves = this.checkWin(row, col, field)
        if (resultMoves)
            return resultMoves
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
