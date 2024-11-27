import { ui } from "./ui.js";
import { getSharedState } from "./sharedState.js";
import { game } from "./game.js";
import { createGameMode } from "./modes/modesFactory.js";

document.addEventListener("DOMContentLoaded", () => {
    const state = getSharedState()
    let gameMode = null
    ui.addPlayerChooseListener()
  
    ui.elements.playBtn.addEventListener("click", async () => {
        const options = ui.getOptions()
        state.initialize(options)
        
        // В будущем в верстке будет не кол-во игроков, а mode выбирать и у них такие value будут
        const gameType = options.playersNumber === 1 ? "humanVsAi" : "humanVsHuman"
        gameMode = await createGameMode(gameType, game, ui, state)
        gameMode.startGame()

        // Initialize events:
        ui.onCellClick = (e) => {
            const targetCell = e.target
            const coords = targetCell.dataset
            gameMode.onCellClick(targetCell, coords)
        };

        ui.onBackBtnClick = () => {
            gameMode.onBackBtnClick()
            gameMode = null
        };

        ui.onResetClick = () => {
            gameMode.onResetClick()
        };

        // Register listeners
        ui.registerListener()
    })
})
