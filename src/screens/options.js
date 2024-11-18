// Такой подход: этот модуль зведует всем, что есть на экране настроек,
//  сохраняет их в объект и экспортирует объект настроек
export const playBtn = document.querySelector(".play-btn")
export const xInput = document.querySelector("#player-x-input")
export const oInput = document.querySelector("#player-o-input")
const choosePlayers = document.querySelector(".players-radio")
export const optionScreen = document.querySelector(".option-screen")

export const haveNames = (playersNum) => {
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

// If one player was choses then only one input should be available for name writing
const handleInputs = (e) => {
    resetInputs()
    if (e.target.checked === true && e.target.value === "1") {
        xInput.addEventListener("input", handleInputBlock)
        oInput.addEventListener("input", handleInputBlock)
    }
}

choosePlayers.addEventListener("change", handleInputs)
