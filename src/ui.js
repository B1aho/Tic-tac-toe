export const ui = {
    screens: {
        options: document.querySelector(".option-screen"),
        play: document.querySelector(".play-screen"),
        info: document.querySelector(".decription-screen"),
    },
    elements: {
        xInput: document.querySelector("#player-x-input"),
        oInput: document.querySelector("#player-o-input"),
        choosePlayers: document.querySelector(".players-radio"),
        playBtn: document.querySelector(".play-btn"),
        resetBtn: document.querySelector('#reset'),
        backBtn: document.querySelector('#back'),
        moveDescription: document.querySelector('#move'),
        playerOneDiv: document.querySelector('#player-1'),
        playerTwoDiv: document.querySelector('#player-2'),
        fieldContainer: document.querySelector('.field'),
    },

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.style.display = "none"
        });
        this.screens[screenName].style.display = "block"
    },

    getOptions() {
        return {
            size: getSize(),
            playersNumber: getPlayersNumber(),
            player1: {
                name: this.elements.xInput.value || "Player X",
                token: "X",
            },
            player2: {
                name: this.elements.oInput.value || "Player O",
                token: "O",
            }
        }
    },

    getSize: () => {
        return document.querySelector('input[name="size"]:checked').value
    },

    getPlayersNumber: () => {
        return Number(document.querySelector('input[name="players-number"]:checked').value)
    },

    renderField(field) {
        // Clear previous game field
        this.elements.fieldContainer.innerHTML = ""
        const fieldWrap = document.createElement("div")
        fieldWrap.id = "field-wrapper"
        this.elements.fieldContainer.append(fieldWrap)
        let rows = 0
        field.forEach(row => {
            let columns = 0
            row.forEach(cell => {
                const btnDiv = document.createElement('div')
                btnDiv.innerText = cell.getValue()
                btnDiv.role = 'button'
                btnDiv.className = 'cell'
                btnDiv.dataset.column = columns++
                btnDiv.dataset.row = rows
                if (columns === cols + 1)
                    columns = 0
                fieldWrap.append(btnDiv)
            })
            rows++
        })
        fieldWrap.style.display = 'grid'
        fieldWrap.style.gridTemplateColumns = `repeat(${field.length}, 1fr)`
        fieldWrap.addEventListener('click', this.onCellClick)
    },

    onCellClick() {
        // It will be filled by main.js
    },

    renderPlayers(firstPlayerName, secondPlayerName) {
        const nameDivOne = document.createElement("div")
        nameDivOne.id = "player-1-name"
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        const nameDivTwo = document.createElement("div")
        nameDivTwo.id = "player-2-name"
        nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

        this.elements.playerOneDiv.prepend(nameDivOne)
        this.elements.playerTwoDiv.prepend(nameDivTwo)
    },

    // Убери this.elements. везде кроме начала, чтобы короче было
    isNamesFilled(playersNumber) {
        if (playersNumber === 1) {
            return this.elements.xInput.value !== "" || this.elements.oInput.value !== "" ? true : false
        } else if (playersNumber === 2) {
            return this.elements.xInput.value !== "" && this.elements.oInput.value !== "" ? true : false
        }
    },

    // If input value have non-empty string, other input block. If input value empty then all inputs avaliable
    blockOtherInput(e) {
        if (e.target === this.elements.xInput) {
            if (this.elements.xInput.value !== "") {
                this.elements.oInput.disabled = true
            } else {
                this.elements.oInput.disabled = false
            }
        } else if (e.target === this.elements.oInput) {
            if (this.elements.oInput.value !== "") {
                this.elements.xInput.disabled = true
            } else {
                this.elements.xInput.disabled = false
            }
        }
    },

    resetInputs() {
        this.elements.xInput.removeEventListener("input", this.blockOtherInput)
        this.elements.oInput.removeEventListener("input", this.blockOtherInput)
        this.elements.oInput.disabled = false
        this.elements.xInput.disabled = false
        this.elements.xInput.value = this.elements.oInput.value = ""
    },

    addPlayerChooseListener() {
        this.elements.choosePlayers.addEventListener("change", this.handleInputsAvaliability)
    },

    // If 1-player mode checked, then only one input can ba filled at time
    handleInputsAvaliability(e) {
        this.resetInputs()
        if (e.target.checked === true && e.target.value === "1") {
            this.elements.xInput.addEventListener("input", this.blockOtherInput)
            this.elements.oInput.addEventListener("input", this.blockOtherInput)
        }
    },

}