// Идея данного модуля в том, что он управляет сменой экранов и каждый экран работает не зная о существовании другого
import { optionScreen, xInput, oInput, haveNames } from "./options";
import { playScreen, renderField, renderPlayers } from "./play";

export const currentOptions = {
    playersNumber: 0,
    player1: {
        name: "",
        token: "X",
        activeTurn: true,
    },
    player2: {
        name: "",
        token: "O",
        activeTurn: false,
    },
    defaultSymbol: "*",
    gridSize: 0,
    AiLevel: 0,
    movesCounter: 0,
}

const handlePlay = () => {
    xName = xInput.value
    oName = oInput.value
    const size = document.querySelector('input[name="size"]:checked').value
    const players = Number(document.querySelector('input[name="players-number"]:checked').value)
    if (haveNames(players)) {
        console.log('have names')
        optionScreen.style.display = "none"
        screenChange(optionScreen, playScreen)
        xName = xName === "" ? "AI" : xName
        oName = oName === "" ? "AI" : oName
        currentOptions.player1.name = xName
        currentOptions.player2.name = oName
        currentOptions.gridSize = size
        currentOptions.playersNumber = players
        renderField(size)
        renderPlayers(xName, oName)
        document.querySelector("#two-players").checked = true
    } else {
        console.log('dont have names')
        // Подсветить красным инпуты
    }
}

export const screenChange = (currScreen, newScreen) => {
    currScreen.style.display = "none"
    newScreen.style.display = "block"
}

playBtn.addEventListener("click", handlePlay)