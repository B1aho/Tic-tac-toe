
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

playBtn.addEventListener("click", handlePlay)