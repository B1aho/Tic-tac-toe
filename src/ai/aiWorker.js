import { createEngine } from "./aiEngine.js";
import { Cell } from "../game.js";
import { getSharedState } from "../sharedState.js";

let engine = null
console.log("Работает new worker")
// Получаем данные из основного потока
self.onmessage = (event) => {
    const { action, sharedState } = event.data
    console.log("Воркер получил: " + action)
    switch (action) {
        case "init":
            addMethods(sharedState)
            engine = createEngine(sharedState)
            self.postMessage('ready'); // Уведомляем главный поток о готовности
            break;
        case "makeMove":
            // Запускаем минимакс или другую логику ИИ
            addMethods(sharedState)
            self.postMessage({ bestMove: engine.makeBestMove(sharedState) })
            break;
        case "reset":
            engine.reset()
            break;
        default:
            break;
    }

function addMethods(state) {
    state.field.map((row) => row.map(cell => Object.setPrototypeOf(cell, Cell.prototype)))
    state.applyMove = function(move, token) {
        this.field[move[0]][move[1]].setValue(token)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    }
    state.undoMove = function(move, token) {
        this.field[move[0]][move[1]].setValue(this.defaultSymbol)
        this.hash ^= this.zobristTable[move[0]][move[1]][token]
    }
    if (state.isExtended) {
        state.applyMove = function(move, token) {
            this.field[move[0]][move[1]].setValue(token)
            this.hash ^= this.zobristTable[move[0]][move[1]][token]
        }
        state.undoExtendedMove = function(move, token, lastMove) {
            // Применяем стертый ход, если он был
            if (lastMove) {
                this.field[lastMove[0]][lastMove[1]].setValue(token)
                this.hash ^= this.zobristTable[lastMove[0]][lastMove[1]][token]
                this.currentMoves[token].unshift(lastMove)
            }
            this.field[move[0]][move[1]].setValue(this.defaultSymbol)
            this.hash ^= this.zobristTable[move[0]][move[1]][token]
            this.currentMoves[token].pop()
        }
    }
    let currState = getSharedState()
    for (const key in sharedState) {
        currState[key] = sharedState[key]
    }
}
/*
    if (action === 'calculateMove') {
        console.log("Get info from TT before: " + state.countGetCash)
        console.log("Store info from TT before: " + state.countStoreCash)
        console.time("Ai move")
        // Запускаем минимакс или другую логику ИИ
        const bestMove = aiEngine.makeBestMove(state)
        console.timeEnd("Ai move")
        console.log("Get info from TT after: " + state.countGetCash)
        console.log("Store info from TT after: " + state.countStoreCash)
        state.countGetCash = 0
        state.countStoreCash = 0
        // Возвращаем результат в основной поток
        self.postMessage({ bestMove })
    }*/
};
