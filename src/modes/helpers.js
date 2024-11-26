import { updateMovesQueue } from "./extendedMode.js";

const worker = new Worker("../ai/aiWorker.js")

export const modeHelpers = (aiEngine, ui, state, game) => {
    const aiMove = () => {
        if (state.gameStatus)
            return
        // Отправляем данные в Worker
        console.log("ИИ думает ...")
        worker.postMessage({ action: 'calculateMove', state });

        // Ожидаем результат
        worker.onmessage = (event) => {
            const { aiMove } = event.data

            // Обновляем состояние игры на основе результата
            ui.renderAiMove(aiMove)
            state.movesCounter++
            checkTerminalState(aiMove[0], aiMove[1])
            // Прячем индикатор
            // hideLoadingIndicator()
        };

        worker.onerror = (error) => {
            console.error('Ошибка в Worker:', error.message)
            // hideLoadingIndicator()
        };
    }

    const humanMove = (targetCell, coords) => {
        // No effect if: no human turn, or game is not active, or cell is not empty
        if (targetCell.innerText !== state.defaultSymbol || state.gameStatus || state.currentPlayer.name === "Player X")
            return null;
        const row = coords.row
        const col = coords.column
        const token = state.currentPlayer.token
        if (state.isExtended)
            updateMovesQueue([row, col], token)
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
    return { checkTerminalState, aiMove, humanMove }
}
