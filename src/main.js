import { ui } from "./ui.js";
import { game } from "./game.js";
import { createEngine } from "./ai/aiEngine.js";
import { getSharedState } from "./sharedState.js";

document.addEventListener("DOMContentLoaded", () => {
    const state = getSharedState()
    let gameStatus = null
    ui.addPlayerChooseListener()
    ui.elements.playBtn.addEventListener("click", () => {
        const options = ui.getOptions()
        // Validate options before starting game
        /*   if (!ui.isNamesFilled(options.playersNumber)) {
               console.log("Fill required options")
               // ui.highlightEmptyInputs()
               return
           }*/
        const players = {
            playerX: {
                name: options.player1.name,
                token: options.player1.token,
            },
            playerO: {
                name: options.player2.name,
                token: options.player2.token,
            },
        }
        // If options were validate then
        // Initialize game
        game.initialize(options.size, players.playerX)
        // Сделать мб field приватной и геттер для нее
        game.createField()
        // Render game
        ui.showScreen("play")
        ui.renderField(game.field)
        ui.renderPlayers(players.playerX.name, players.playerO.name)
      //  state.currentPlayer = players.playerX
        ui.updateMoveDescription(null, state.currentPlayer.name)
        // Убрать потом, почему выше написано
        const AI = (options.playersNumber === 1) ? true : false
        if (AI) {
            var aiEngine = createEngine({ timeOut: 600000, })
            // Вынести один общий shared state мб, не два отдельных для АИ и game
            state.isMax = players.playerX.name === "Player X" ? true : false
            if (state.isMax) {
                console.time("Ai move")
                let aiMove = aiEngine.getBestMove(state)
                console.timeEnd("Ai move")
                aiEngine.makeMove(aiMove)
                ui.renderAiMove(aiMove, state.currentPlayer.token)
                state.movesCounter++ 
                console.log("movesCounte++")
                game.nextPlayerMove(state.currentPlayer === players.playerX ? players.playerO : players.playerX)
                ui.updateMoveDescription(null, state.currentPlayer.name)
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
            if (targetCell.innerText !== game.getDeafultSymbol() || gameStatus)
                return
            // No effect if is not human turn
            if (state.currentPlayer.name === "Player X")
                return
            // Update field data
            game.updateFieldValue(row, col, token)
            // Update cell rendering
            targetCell.innerText = token
            state.movesCounter++ 
            console.log("movesCounte++")
            // Check if game over
            // Check game end
            gameStatus = game.checkTerminalState(row, col)
            if (gameStatus) {
                ui.updateMoveDescription(gameStatus, state.currentPlayer.name)
                return;
            }
            game.nextPlayerMove(state.currentPlayer === players.playerX ? players.playerO : players.playerX)
            ui.updateMoveDescription(null, state.currentPlayer.name)
            // Next-move logic for 1/2 players modes 
            if (AI) {
                console.time("Ai move")
                let aiMove = aiEngine.getBestMove(state)
                console.timeEnd("Ai move")
                aiEngine.makeMove(aiMove)
                ui.renderAiMove(aiMove, state.currentPlayer.token)
                state.movesCounter++ 
                console.log("movesCounte++")
                gameStatus = game.checkTerminalState(aiMove[0], aiMove[1])
                if (gameStatus) {
                    ui.updateMoveDescription(gameStatus, state.currentPlayer.name)
                    return;
                }
                game.nextPlayerMove(state.currentPlayer === players.playerX ? players.playerO : players.playerX)
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
            // ai.back()
            /*
            ai.evaluateMaxDepth()
            ai.transpositionTable.clear()
            */
        };
        ui.onResetClick = () => {
            game.reset(players.playerX)
            ui.updateMoveDescription(null, state.currentPlayer.name)
            ui.resetFieldRender()
            gameStatus = null
            // в game reset записать
            state.movesCounter = 0
            // ai.reset()
            /*
            initialHash = initHash()
            transpositionTable.clear()
            evaluateMaxDepth()
            if (game.currentPlayer.name === AI)
                 makeAiMove()
             */
        };
        // Register listeners
        ui.registerListener()
    })
})
