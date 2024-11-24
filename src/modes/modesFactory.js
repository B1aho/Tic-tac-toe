import { humanVsAi } from "./humanVsAi.js";
import { humanVsHuman } from "./humanVsHuman.js";
import { createEngine } from "../ai/aiEngine.js";

export const createGameMode = (gameType, game, ui, state) => {
    if (state.isExtended) {
        // Добавить 
    }
    switch(gameType) {
        case "humanVsAi":
            return humanVsAi(game, ui, state, createAi(game))
        case "humanVsHuman":
            return humanVsHuman(game, ui, state)
        default:
            throw new Error("Unknown game mode: " + gameType)
    }

    function createAi() {
        game.createField()
        return createEngine({ timeOut: 6000, })
    }
}