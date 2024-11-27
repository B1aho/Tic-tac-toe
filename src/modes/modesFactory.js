import { humanVsAi } from "./humanVsAi.js";
import { humanVsHuman } from "./humanVsHuman.js";
import { addExtendedState } from "./extendedMode.js";

export const createGameMode = async (gameType, game, ui, state) => {
    if (state.isExtended) {
        addExtendedState()
    }

    let worker = null
    switch(gameType) {
        case "humanVsAi":
            game.createField()
            worker = await initWorker()
            return humanVsAi(game, ui, state, worker)
        case "humanVsHuman":
            return humanVsHuman(game, ui, state)
        default:
            throw new Error("Unknown game mode: " + gameType)
    }

    function waitForWorkerReady(worker) {
        return new Promise((resolve) => {
            worker.onmessage = (e) => {
                if (e.data === "ready") {
                    console.log("Worker is ready");
                    resolve(); // Разрешаем promise, когда воркер готов
                }
            };
        });
    }

    async function initWorker() {
        const worker = new Worker("./src/ai/aiWorker.js",  { type: 'module' })
        const sharedState = JSON.parse(JSON.stringify(state))
        worker.postMessage({ action: "init", sharedState})
        await waitForWorkerReady(worker)
        console.log("Воркер проинициализирован")
        return worker
    }
}