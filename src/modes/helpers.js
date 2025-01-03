import { updateMovesQueue } from "./extendedMode.js";

export const modeHelpers = (aiEngineWorker, ui, state, game) => {
    const aiMove = () => {
        if (state.gameStatus)
            return
        // Отправляем данные в Worker     
        console.log("ИИ думает...")
        const sharedState = JSON.parse(JSON.stringify(state))
        aiEngineWorker.postMessage({ action: "makeMove", sharedState });
        // Блокируем поле для взаимодействия пользователя, покка ожидаем ответа ИИ
        // Меняем выражения лица ИИ. Всё мб одной функцией ui.aiThinking
        ui.whenAiThinking()
        // Ожидаем результат
        aiEngineWorker.onmessage = (event) => {
            const aiMove = event.data.bestMove
            console.log("Воркер вернул ход: " + aiMove)
            // Обновляем состояние игры на основе результата
            game.updateFieldValue(aiMove[0], aiMove[1], state.currentPlayer.token)
            if (state.isExtended)
                updateMovesQueue(aiMove, state.currentPlayer.token)
            setTimeout(() => {
                ui.renderAiMove(aiMove)
            state.movesCounter++
            checkTerminalState(aiMove[0], aiMove[1], state.field)
            ui.aiDoneThinking()
            }, 300)
            // Прячем индикатор
            // hideLoadingIndicator()
        };

        aiEngineWorker.onerror = (error) => {
            console.error('Ошибка в Worker:', error.message, error.filename, error.lineno, error.colno)
            // hideLoadingIndicator()
        };
    }

    const humanMove = (targetCell, coords) => {
        // No effect if: no human turn, or game is not active, or cell is not empty
        if (coords.row === undefined || targetCell.innerText !== state.defaultSymbol || state.gameStatus || state.currentPlayer.name === "AI\u3000")
            return null;
        const row = coords.row
        const col = coords.column
        const token = state.currentPlayer.token
        if (state.isExtended)
            updateMovesQueue([row, col], token)
        // Human make move:
        game.updateFieldValue(row, col, token)
        ui.renderMove([row, col], token)
        // Update cell rendering
        targetCell.innerText = token
        state.movesCounter++
        // Check if game over
        checkTerminalState(row, col, state.field)
    }

    const checkTerminalState = (row, col, field) => {
        let result = null
        if (state.movesCounter > 4) {
            result = game.checkTerminalState(row, col, field)
            state.gameStatus = result === "draw" ? "draw" : result ? "win" : null
        }
        if (state.gameStatus) {
            ui.updateMoveDescription()
            ui.blockPointer()
            if (state.gameStatus === "win")
                ui.highlightWinningLine(result)
            return;
        }
        game.nextPlayerMove()
        ui.updateMoveDescription()
    }
    return { checkTerminalState, aiMove, humanMove }
}
