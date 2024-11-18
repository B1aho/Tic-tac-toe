"use strict";

let BenchCount = 0

const resetGame = () => {
    console.table(field.map(el => el.map(cell => cell.getValue())))
    fieldControl.resetField()
    console.table(field.map(el => el.map(cell => cell.getValue())))
    movesCounter = 0
    activeTurn = players[0]
    initialHash = initHash()
    transpositionTable.clear()
    evaluateMaxDepth()
}