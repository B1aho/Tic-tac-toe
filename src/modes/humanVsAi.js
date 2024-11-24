import { modeHelpers } from "./helpers.js"

export const humanVsAi = (game, ui, state, aiEngine) => {
    const helpers = modeHelpers(aiEngine, ui, state, game)

    const startGame = () => {
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
        if (helpers.humanMove(targetCell, coords) !== null)
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