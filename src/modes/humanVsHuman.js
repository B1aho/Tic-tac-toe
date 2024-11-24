import { modeHelpers } from "./helpers.js";

export const humanVsHuman = (game, ui, state) => {
    const helpers = modeHelpers(null, ui, state, game)

    const startGame = () => {
        game.createField()
        // Render game
        ui.showScreen("play")
        ui.renderField()
        ui.renderPlayers()
        ui.updateMoveDescription(null)
    }

    const onCellClick = (targetCell, coords) => {
        helpers.humanMove(targetCell, coords)
    }

    const onResetClick = () => {
        state.reset()
        game.resetField()
        ui.updateMoveDescription(null)
        ui.resetFieldRender()
    }

    const onBackBtnClick = () => {
        state.back()
        ui.removeListener()
        ui.showScreen("options")
    }

    return { startGame, onCellClick, onResetClick, onBackBtnClick }
}