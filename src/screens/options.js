const playBtn = document.querySelector(".play-btn")
const xInput = document.querySelector("#player-x-input")
const oInput = document.querySelector("#player-o-input")
const choosePlayers = document.querySelector(".players-radio")
const optionScreen = document.querySelector(".option-screen")

const handlePlay = () => {
    const size = document.querySelector('input[name="size"]:checked').value
    const players = Number(document.querySelector('input[name="players-number"]:checked').value)
    if (haveNames(players)) {
        console.log('have names')
        optionScreen.style.display = "none"
        xInput.value = xInput.value === "" ? "AI" : xInput.value
        oInput.value = oInput.value === "" ? "AI" : oInput.value
        PlayScreenControl(xInput.value, oInput.value, Number(size) - 1)
        document.querySelector("#two-players").checked = true
        resetInputs()
    } else {
        console.log('don have names')
        // Подсветить красным инпуты
    }
}

const haveNames = (playersNum) => {
    if (playersNum === 1) {
        return xInput.value !== "" || oInput.value !== "" ? true : false
    } else if (playersNum === 2) {
        return xInput.value !== "" && oInput.value !== "" ? true : false
    }
}

// If input value have non-empty string, other input block. If input value empty then all inputs avaliable
const handleInputBlock = (e) => {
    if (e.target === xInput) {
        if (xInput.value !== "") {
            oInput.disabled = true
        } else {
            oInput.disabled = false
        }
    } else if (e.target === oInput) {
        if (oInput.value !== "") {
            xInput.disabled = true
        } else {
            xInput.disabled = false
        }
    }
}

const resetInputs = () => {
    xInput.removeEventListener("input", handleInputBlock)
    oInput.removeEventListener("input", handleInputBlock)
    oInput.disabled = false
    xInput.disabled = false
    xInput.value = oInput.value = ""
}

// If one player was choses then only on input should be available for name writing
const handleInputs = (e) => {
    resetInputs()
    if (e.target.checked === true && e.target.value === "1") {
        xInput.addEventListener("input", handleInputBlock)
        oInput.addEventListener("input", handleInputBlock)
    }
}
playBtn.addEventListener("click", handlePlay)
choosePlayers.addEventListener("change", handleInputs)
