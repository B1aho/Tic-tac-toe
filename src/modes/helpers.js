
export const modeHelpers = (aiEngine, ui, state, game) => {
const aiMove = () => {
    console.time("Ai move")
    console.log("Get info from TT before: " + state.countGetCash)
    console.log("Store info from TT before: " + state.countStoreCash)
    let aiMove = aiEngine.makeBestMove(state)
    console.timeEnd("Ai move")
    console.log("Get info from TT after: " + state.countGetCash)
    console.log("Store info from TT after: " + state.countStoreCash)
    state.countGetCash = 0
    state.countStoreCash = 0
    ui.renderAiMove(aiMove)
    state.movesCounter++
    checkTerminalState(aiMove[0], aiMove[1])
}

const humanMove = (targetCell, coords) => {
    const row = coords.row
    const col = coords.column
    const token = state.currentPlayer.token
    // No effect if: no human turn, or game is not active, or cell is not empty
    if (targetCell.innerText !== state.defaultSymbol || state.gameStatus || state.currentPlayer.name === "Player X")
        return
    // Human make move:
    game.updateFieldValue(row, col, token)
    // Update cell rendering
    targetCell.innerText = token
    state.movesCounter++
    // Check if game over
    checkTerminalState(row, col)
}

const checkTerminalState = (row, col) => {
    if (state.movesCounter > 4)
        state.gameStatus = game.checkTerminalState(row, col)
    if (state.gameStatus) {
        ui.updateMoveDescription()
        return;
    }
    game.nextPlayerMove()
    ui.updateMoveDescription()
}
    return { checkTerminalState, aiMove, humanMove}
}
