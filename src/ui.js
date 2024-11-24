// Пусть автоматические в блокированном инпуте АИ имя возникает

import { defaultSymbol } from "./defaultSymbol.js";

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
        twoPlayersMode: document.querySelector("#two-players"),
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
        // Get current options
        const options = {
            size: this.getSize(),
            playersNumber: this.getPlayersNumber(),
            player1: {
                name: this.elements.xInput.value || "Player X",
                token: "X",
            },
            player2: {
                name: this.elements.oInput.value || "Player O",
                token: "O",
            }
        }
        // Set options to default 
        this.elements.xInput.value = this.elements.oInput.value = "" // Мб оставить имена
        this.elements.xInput.disabled = this.elements.oInput.disabled = false 
        this.elements.twoPlayersMode.checked = true
        return options
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
                if (columns === field.length)
                    columns = 0
                fieldWrap.append(btnDiv)
            })
            rows++
        })
        fieldWrap.style.display = "grid"
        fieldWrap.style.gridTemplateColumns = `repeat(${field.length}, 1fr)`
        //fieldWrap.addEventListener("click", this.onCellClick)
        //this.elements.backBtn.addEventListener("click", this.onBackBtnClick)
        //this.elements.resetBtn.addEventListener("click", this.onResetClick)
    },

    removeListener() {
        document.querySelector("#field-wrapper").removeEventListener("click", this.onCellClick)
        this.removeInputListener()
        this.elements.resetBtn.removeEventListener("click", this.onResetClick)
        this.elements.backBtn.removeEventListener("click", this.onBackBtnClick)
    },

    resetFieldRender(field) {
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => cell.innerText = defaultSymbol)
    },

    removeInputListener() {
        this.elements.xInput.removeEventListener("input", this.blockInputListeners.xInput)
        this.elements.oInput.removeEventListener("input", this.blockInputListeners.oInput)
    },

    registerListener() {
        document.querySelector("#field-wrapper").addEventListener("click", this.onCellClick)
        this.elements.resetBtn.addEventListener("click", this.onResetClick)
        this.elements.backBtn.addEventListener("click", this.onBackBtnClick)
    },

    onCellClick() {
        // It will be filled by main.js
    },

    onBackBtnClick() {
        // It will be filled by main.js
    },

    onResetClick(){
        // It will be filled by main.js
    },

    renderPlayers(firstPlayerName, secondPlayerName) {
        // Clear previous content
        this.elements.playerOneDiv.innerHTML = this.elements.playerTwoDiv.innerHTML = ""
        // Create new names
        const nameDivOne = document.createElement("div")
        nameDivOne.id = "player-1-name"
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        const nameDivTwo = document.createElement("div")
        nameDivTwo.id = "player-2-name"
        nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

        this.elements.playerOneDiv.prepend(nameDivOne)
        this.elements.playerTwoDiv.prepend(nameDivTwo)
    },

    updateMoveDescription(state, currentName) {
        const moveDescDiv = this.elements.moveDescription
        if (state === "win") {
            moveDescDiv.innerText = `${currentName} is the winner. Congratulation!`
        } else if (state === "draw") {
            moveDescDiv.innerText = "Draw. No one lose.."
        } else {
            moveDescDiv.innerText = `It is now ${currentName}'s turn!`
        }
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

    blockInputListeners: {
        xInput: null,
        oInput: null,
    },

    resetInputs() {
        this.elements.xInput.removeEventListener("input", (e) => this.blockOtherInput(e))
        this.elements.oInput.removeEventListener("input", (e) => this.blockOtherInput(e))
        this.elements.oInput.disabled = false
        this.elements.xInput.disabled = false
        this.elements.xInput.value = this.elements.oInput.value = ""
    },

    // Arrow function look for the parent scope's context binding - addPlayerChooseListener()
    addPlayerChooseListener() {
        this.elements.choosePlayers.addEventListener("change", (e) => this.handleInputsAvaliability(e))
    },

    // If 1-player mode checked, then only one input can ba filled at time
    handleInputsAvaliability(e) {
        this.resetInputs()
        if (e.target.checked === true && e.target.value === "1") {
            this.blockInputListeners.xInput = (e) => this.blockOtherInput(e)
            this.blockInputListeners.oInput = (e) => this.blockOtherInput(e)
            this.elements.xInput.addEventListener("input", this.blockInputListeners.xInput)
            this.elements.oInput.addEventListener("input", this.blockInputListeners.oInput)
        } else {
            this.removeInputListener()
        }
    },

    renderAiMove(coords, token) {
        const row = coords[0]
        const col = coords[1]
        document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`).innerText = token
    },
}

 // Validate options before starting game
        /*   if (!ui.isNamesFilled(options.playersNumber)) {
               console.log("Fill required options")
               // ui.highlightEmptyInputs()
               return
           }*/