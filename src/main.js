import { ui } from "./ui.js";
import { game } from "./game.js";
import { createEngine } from "./ai/aiEngine.js";
import { getSharedState } from "./sharedState.js";

document.addEventListener("DOMContentLoaded", () => {
    const state = getSharedState()
    // в modes
    let gameStatus = null
    ui.addPlayerChooseListener()
    // По нажатию на play
    ui.elements.playBtn.addEventListener("click", () => {
        const options = ui.getOptions()
        // If options were validate then
        // Initialize state
        state.initialize(options)
        // Сделать мб field приватной и геттер для нее
        game.createField()
        // Render game
        ui.showScreen("play")
        ui.renderField(state.field)
        ui.renderPlayers(state.players.playerX.name, state.players.playerO.name)
        ui.updateMoveDescription(null, state.currentPlayer.name)
        // Убрать потом, почему выше написано
        const AI = (options.playersNumber === 1) ? true : false
        if (AI) {
            var aiEngine = createEngine({ timeOut: 6000, })
            // Вынести один общий shared state мб, не два отдельных для АИ и game
            state.isMax = state.players.playerX.name === "Player X" ? true : false
            if (state.isMax) {
                aiMove()
            }
        }
        // Initialize events:
        ui.onCellClick = (e) => {
            const targetCell = e.target
            const coords = targetCell.dataset
            const row = coords.row
            const col = coords.column
            const token = state.currentPlayer.token
            // No effect if cell is not empty
            if (targetCell.innerText !== state.defaultSymbol || gameStatus)
                return
            // No effect if is not human turn
            if (state.currentPlayer.name === "Player X")
                return
            // Update field data
            game.updateFieldValue(row, col, token)
            // Update cell rendering
            targetCell.innerText = token
            state.movesCounter++
            // Check if game over
            // Check game end
            if (state.movesCounter > 4)
                gameStatus = game.checkTerminalState(row, col)
            if (gameStatus) {
                ui.updateMoveDescription(gameStatus, state.currentPlayer.name)
                return;
            }
            game.nextPlayerMove()
            ui.updateMoveDescription(null, state.currentPlayer.name)
            // Next-move logic for 1/2 players modes 
            if (AI) {
                console.time("Ai move")
                console.log("Get info from TT before: " + state.countGetCash)
            console.log("Store info from TT before: " + state.countStoreCash)
                let aiMove = aiEngine.makeBestMove(state)
                console.timeEnd("Ai move")
                console.log("Get info from TT after: " + state.countGetCash)
            console.log("Store info from TT after: " + state.countStoreCash)
            state.countGetCash = 0
            state.countStoreCash = 0
                ui.renderAiMove(aiMove, state.currentPlayer.token)
                state.movesCounter++
                if (state.movesCounter > 4)
                    gameStatus = game.checkTerminalState(aiMove[0], aiMove[1])
                if (gameStatus) {
                    ui.updateMoveDescription(gameStatus, state.currentPlayer.name)
                    return;
                }
                game.nextPlayerMove()
                ui.updateMoveDescription(null, state.currentPlayer.name)
            }
        };
        ui.onBackBtnClick = () => {
            game.back()
            ui.removeListener()
            ui.showScreen("options")
            gameStatus = null
            // в game reset записать
            state.movesCounter = 0
            if (AI) {
                //aiEngine.reset()
                aiEngine = null
            }
        };
        ui.onResetClick = () => {
            game.reset()
            ui.updateMoveDescription(null, state.currentPlayer.name)
            ui.resetFieldRender()
            gameStatus = null
            // в game reset записать
            state.movesCounter = 0
            if (AI) {
                aiEngine.reset()
                if (state.isMax)
                    aiMove()
            }
        };

        function aiMove() {
            console.time("Ai move")
            console.log("Get info from TT before: " + state.countGetCash)
            console.log("Store info from TT before: " + state.countStoreCash)
            let aiMove = aiEngine.makeBestMove(state)
            console.timeEnd("Ai move")
            console.log("Get info from TT after: " + state.countGetCash)
            console.log("Store info from TT after: " + state.countStoreCash)
            state.countGetCash = 0
            state.countStoreCash = 0
            ui.renderAiMove(aiMove, state.currentPlayer.token)
            state.movesCounter++
            game.nextPlayerMove()
            ui.updateMoveDescription(null, state.currentPlayer.name)
        }
        // Register listeners
        ui.registerListener()

    })


})
