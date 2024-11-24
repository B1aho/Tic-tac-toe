import { modeHelpers } from "./helpers.js"

// Если ниче не работает, то вынести ui, game, state в const, чтобы  не передавать их
export const humanVsAi = (game, ui, state, aiEngine) => {
    const helpers = modeHelpers(aiEngine, ui, state, game)

    const startGame = () => {
        game.createField()
        // Render - вынести в helper  функцию общую common helpers
        ui.showScreen("play")
        ui.renderField()
        ui.renderPlayers()
        ui.updateMoveDescription(null)

        state.isMax = state.players.playerX.name === "Player X" ? true : false
        if (state.isMax) {
            helpers.aiMove()
        }
    }

    const onCellClick = (targetCell, coords) => {
        helpers.humanMove(targetCell, coords)
        helpers.aiMove()
    }

    const onResetClick = () => {
        state.reset()
        game.resetField()
        aiEngine.reset()
        ui.updateMoveDescription(null)
        ui.resetFieldRender()

        if (state.isMax)
            helpers.aiMove()
    }

    const onBackBtnClick = () => {
        state.back()
        ui.removeListener()
        ui.showScreen("options")
    }

    return { startGame, onCellClick, onResetClick, onBackBtnClick }
}