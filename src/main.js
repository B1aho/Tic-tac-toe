import { ui } from "./ui";
import { game } from "./game";

document.addEventListener("DOMContentLoaded", () => {
    ui.elements.playBtn.addEventListener("click", () => {
        // Validate options before starting game
        ui.addPlayerChooseListener()
        if (!ui.isNamesFilled) {
            console.log("Fill required options")
            // ui.highlightEmptyInputs()
            return
        }
        const options = ui.getOptions()
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
        const AI = (options.playersNumber === 1) ? true : false
        game.initialize(options.size, players.playerX)
        // Сделать мб field приватной и геттер для нее
        game.createField()
        // Render game
        ui.showScreen("game")
        ui.renderField(game.field)
        ui.renderPlayers(players.playerX.name, players.playerO.name)
        ui.updateMoveDescription("First turn")
        // Initialize events:
        ui.onCellClick = (e) => {
            const targetCell = e.target
            const coords = targetCell.dataset
            const row = coords.row
            const col = coords.column
            const token = game.currentPlayer.token
            // No effect if cell is not empty
            if (targetCell.innerText !== game.getDeafultSymbol())
                return
            // No effect if is not human turn
            if (game.currentPlayer.name === "AI")
                return
            const result = game.checkTerminalState(row, col)
            // Update field data
            game.updateFieldValue(row, col, token)
            // Update cell rendering
            target.innerText = token
            // Check if game over
            if (result) {
                // Убедиться насколько нужен данный ремувер. Ведь у нас и так должен блокаться клик на занятых, с другой стороны когда бэк нажата правильнее будет убирать все листенеры одной функцией
                ui.updateMoveDescription(result, game.currentPlayer.name)
                return;
            }
            // Next-move logic for 1/2 players modes 
            if (AI) {
                // game.initialHash ^= game.zobristTable[row][col][token]
                // makeAiMove()
            } else {
                game.nextPlayerMove(game.currentPlayer === players.playerX ? players.playerO : players.playerX)
                ui.updateMoveDescription(game.currentPlayer.name)
            }
        };
        ui.onBackBtnClick = () => {
            game.back()
            ui.removeListener()
            ui.showScreen("options")
            // ai.back()
            /*
            ai.evaluateMaxDepth()
            ai.transpositionTable.clear()
            */
        };
        ui.onResetClick = () => {
            game.reset(players.playerX)
            ui.updateMoveDescription(game.currentPlayer.name)
            // ai.reset()
            /*
            initialHash = initHash()
            transpositionTable.clear()
            evaluateMaxDepth()
            if (game.currentPlayer.name === AI)
                 makeAiMove()
             */
        };
    })
})
