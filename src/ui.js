// Пусть автоматические в блокированном инпуте АИ имя возникает
import { getSharedState } from "./sharedState.js";

const state = getSharedState()

export const ui = {
    screens: {
        options: document.querySelector(".option-screen"),
        play: document.querySelector(".play-screen"),
        info: document.querySelector(".decription-screen"),
    },
    elements: {
        main: document.querySelector("main"),
        aiLevels: document.querySelector("#ai-levels"),
        xInput: document.querySelector("#player-x-input"),
        oInput: document.querySelector("#player-o-input"),
        choosePlayers: document.querySelector(".players-radio"),
        twoPlayersMode: document.querySelector("#two-players"),
        playBtn: document.querySelector("#play"),
        resetBtn: document.querySelector('#reset'),
        infoBtn: document.querySelector('#info-btn'),
        backBtn: document.querySelector('#back'),
        cancelInfoBtn: document.querySelector('#cancel-info-btn'),
        moveDescription: document.querySelector('#move'),
        playerOneDiv: document.querySelector('#player-1'),
        playerTwoDiv: document.querySelector('#player-2'),
        playerXname: document.querySelector("#x-name"),
        playerOname: document.querySelector("#o-name"),
        xAvatar: document.querySelector("#x-avatar"),
        oAvatar: document.querySelector("#o-avatar"),
        fieldContainer: document.querySelector('.field'),
    },

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.style.display = "none"
        });
        this.screens[screenName].style.display = "flex"
        state.currentScreen = this.screens[screenName]
    },

    getOptions() {
        // For 1-player mode name is required
        const playersNumber = this.getPlayersNumber()
        if (playersNumber === 1) {
            if (!ui.checkInputRequired())
                return
        }
        // Get current options
        const options = {
            size: this.getSize(),
            playersNumber: playersNumber,
            player1: {
                name: this.elements.xInput.value || "Player X",
                token: "X",
            },
            player2: {
                name: this.elements.oInput.value || "Player O",
                token: "O",
            },
            isExtended: this.getExtended(),
        }
        if (options.playersNumber === 1) state.haveAi = true
        document.querySelector(":root").style.setProperty('--field-size', options.size);
        if (playersNumber === 1)
            options.aiLevels = this.elements.aiLevels.value
        // Set options to default 
        this.elements.xInput.disabled = this.elements.oInput.disabled = false
        this.elements.aiLevels.disabled = true
        setTimeout(() => {
            this.elements.twoPlayersMode.checked = true
            this.elements.xInput.value = this.elements.oInput.value = "" // Мб оставить имена
        }, 800)
        return options
    },

    checkInputRequired() {
        const xInput = this.elements.xInput
        const oInput = this.elements.oInput
        if (xInput.value !== "" || oInput.value !== "")
            return true
        else {
            xInput.classList.add("warning")
            oInput.classList.add("warning")
            return false
        }
    },

    getSize: () => {
        return document.querySelector('input[name="size"]:checked').value
    },

    getPlayersNumber: () => {
        return Number(document.querySelector('input[name="players-number"]:checked').value)
    },

    getExtended: () => {
        return document.querySelector('input[name="extended-mode"]:checked').value
    },

    renderField() {
        const field = state.field
        // Clear previous game field
        this.elements.fieldContainer.innerHTML = ""
        const fieldWrap = document.createElement("div")
        fieldWrap.id = "field-wrapper"
        this.elements.fieldContainer.append(fieldWrap)
        let rows = 0
        field.forEach(row => {
            let columns = 0
            row.forEach(cell => {
                const btnWrap = document.createElement('div')
                const btnDiv = document.createElement('div')
                btnDiv.innerText = cell.getValue()
                btnDiv.role = 'button'
                btnDiv.className = 'cell'
                btnDiv.dataset.column = columns++
                btnDiv.dataset.row = rows
                if (columns === field.length)
                    columns = 0
                fieldWrap.append(btnWrap)
                btnWrap.append(btnDiv)
            })
            rows++
        })
    },

    removeListener() {
        document.querySelector("#field-wrapper").removeEventListener("pointerdown", this.onCellClick)
        this.removeInputListener()
        this.elements.resetBtn.removeEventListener("click", this.onResetClick)
        this.elements.backBtn.removeEventListener("click", this.onBackBtnClick)
    },

    resetFieldRender() {
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.innerText = state.defaultSymbol
            cell.style.pointerEvents = "auto"
            cell.classList.remove("cross")
            cell.classList.remove("zero")
            cell.classList.remove("win")
            cell.classList.remove("last")
        })
        this.resetPointer()
    },

    removeInputListener() {
        this.elements.xInput.removeEventListener("input", this.blockInputListeners.xInput)
        this.elements.oInput.removeEventListener("input", this.blockInputListeners.oInput)
    },

    registerListener() {
        document.querySelector("#field-wrapper").addEventListener("pointerup", this.onCellClick)
        this.elements.resetBtn.addEventListener("click", this.onResetClick)
        this.elements.backBtn.addEventListener("click", this.onBackBtnClick)
    },

    onCellClick() {
        // It will be filled by main.js
    },

    onBackBtnClick() {
        // It will be filled by main.js
    },

    onResetClick() {
        // It will be filled by main.js
    },

    renderPlayers() {
        const firstPlayerName = state.players.playerX.name
        const secondPlayerName = state.players.playerO.name
        const xName = this.elements.playerXname
        const oName = this.elements.playerOname
        // Clear previous content
        xName.innerText = ""
        oName.innerText = ""
        this.elements.xAvatar.setAttribute("src", "./assets/images/man-user-svgrepo-com.svg")
        this.elements.oAvatar.setAttribute("src", "./assets/images/man-user-svgrepo-com.svg")
        // Create new names
        xName.innerText = `${firstPlayerName}`
        oName.innerText = `${secondPlayerName}`

        if (state.haveAi) {
            if (firstPlayerName === "AI\u3000") {
                this.elements.xAvatar.setAttribute("src", "./assets/images/robot.svg")
            } else {
                this.elements.oAvatar.setAttribute("src", "./assets/images/robot.svg")
            }
        }
    },

    updateMoveDescription() {
        const moveDescDiv = this.elements.moveDescription
        const gameStatus = state.gameStatus
        let name = state.currentPlayer.name
        if (name.includes("AI"))
            name = "AI"
        if (gameStatus === "win") {
            if (state.currentPlayer.name === "AI\u3000")
                moveDescDiv.innerText = `${name} - winner 🏆. AI world domination coming soon..`
            else {
                if (state.haveAi)
                    moveDescDiv.innerText = "You've defeated the AI! Humanity is proud of you"
                else
                    moveDescDiv.innerText = `${name} is the winner 🏆`
            }
        } else if (gameStatus === "draw") {
            moveDescDiv.innerText = "Draw. No one lose.."
        } else {
            if (state.currentPlayer.name === "AI\u3000")
                moveDescDiv.innerText = "AI is thinking.."  
            else
                moveDescDiv.innerText = `It is now ${name}'s turn!`
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
                this.elements.xInput.classList.remove("warning")
                this.elements.oInput.classList.remove("warning")
                this.elements.oInput.value = "AI\u3000"
                this.elements.oInput.disabled = true
            } else {
                this.elements.oInput.value = ""
                this.elements.oInput.disabled = false
            }
        } else if (e.target === this.elements.oInput) {
            if (this.elements.oInput.value !== "") {
                this.elements.xInput.classList.remove("warning")
                this.elements.oInput.classList.remove("warning")
                this.elements.xInput.value = "AI\u3000"
                this.elements.xInput.disabled = true
            } else {
                this.elements.xInput.value = ""
                this.elements.xInput.disabled = false
            }
        }
    },

    blockInputListeners: {
        xInput: null,
        oInput: null,
    },

    resetInputs() {
        this.elements.xInput.classList.remove("warning")
        this.elements.oInput.classList.remove("warning")
        this.elements.xInput.removeEventListener("input", (e) => this.blockOtherInput(e))
        this.elements.oInput.removeEventListener("input", (e) => this.blockOtherInput(e))
        this.elements.oInput.disabled = false
        this.elements.xInput.disabled = false
        this.elements.xInput.value = this.elements.oInput.value = ""
    },

    // Arrow function look for the parent scope's context binding - addPlayerChooseListener()
    initMainUi() {
        this.elements.choosePlayers.addEventListener("change", (e) => this.handleInputsAvaliability(e))
        this.elements.main.style.pointerEvents = "auto"
        this.elements.infoBtn.addEventListener("click", () => this.showInfo())
        this.elements.cancelInfoBtn.addEventListener("click", () => this.closeInfoScreen())
        state.currentScreen = this.screens.options
    },

    closeInfoScreen() {
        state.currentScreen.style.display = "flex"
        this.screens.info.style.display = "none"
    },

    showInfo() {
        this.screens.options.style.display = "none"
        this.screens.play.style.display = "none"
        this.screens.info.style.display = "flex"
    },

    // If 1-player mode checked, then only one input can ba filled at time
    handleInputsAvaliability(e) {
        this.resetInputs()
        if (e.target.checked === true && e.target.value === "1") {
            this.elements.aiLevels.disabled = false
            this.blockInputListeners.xInput = (e) => this.blockOtherInput(e)
            this.blockInputListeners.oInput = (e) => this.blockOtherInput(e)
            this.elements.xInput.addEventListener("input", this.blockInputListeners.xInput)
            this.elements.oInput.addEventListener("input", this.blockInputListeners.oInput)
        } else {
            this.elements.aiLevels.disabled = true
            this.removeInputListener()
        }
    },

    renderAiMove(coords) {
        const row = coords[0]
        const col = coords[1]
        document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`).innerText = state.currentPlayer.token
        this.renderMove([row, col], state.currentPlayer.token)
    },

    unrenderMove(move) {
        const row = move[0]
        const col = move[1]
        document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`).innerText = state.defaultSymbol
    },

    whenAiThinking() {
        const fieldWrapper = document.querySelector("#field-wrapper")
        fieldWrapper.style.pointerEvents = "none"
        this.elements.fieldContainer.style.cursor = "wait"
        console.log("ИИ думает..")
    },

    aiDoneThinking() {
        const fieldWrapper = document.querySelector("#field-wrapper")
        fieldWrapper.style.pointerEvents = "auto"
        this.elements.fieldContainer.style.cursor = "default"
        console.log("ИИ подумал!")
    },

    renderMove(move, token) {
        const row = move[0]
        const col = move[1]
        const className = token === "X" ? "cross" : "zero"
        const cell = document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`)
        cell.classList.add(className)
        cell.style.pointerEvents = "none"
        if (state.isExtended) {
            const {currentMoves, winLength} = state
            if (currentMoves[token].length >= winLength) {
                this.highlightLastMove(currentMoves[token][0])
            }
        }
    },

    highlightLastMove(move) {
        const [row, col] = move
        document.querySelector(`[data-row="${CSS.escape(row)}"][data-column="${CSS.escape(col)}"]`).classList.add("last")
    },

    unHighlightLast(move) {
        const [row, col] = move
        const cell = document.querySelector(`[data-row="${CSS.escape(row)}"][data-column="${CSS.escape(col)}"]`)
        cell.classList.remove("last")
        if (cell.className.includes("cross"))
            cell.classList.remove("cross")
        else
            cell.classList.remove("zero")
        cell.style.pointerEvents = "auto"
    },

    blockPointer() {
        document.querySelector("#field-wrapper").style.pointerEvents = "none"
    },

    resetPointer() {
        document.querySelector("#field-wrapper").style.pointerEvents = "auto"
    },

    highlightWinningLine(winMoves) {
        winMoves.forEach(([ row, col ]) => {
            const cell = document.querySelector(`[data-row="${CSS.escape(row)}"][data-column="${CSS.escape(col)}"]`)
            if (cell) {
                cell.classList.add("win")
                cell.classList.remove("last")
            }
        })
        this.blockPointer()
    },

     resetHighlight() {
        document.querySelectorAll('.win').forEach((cell) => {
            cell.classList.remove('win')
        })
    },
}

// Validate options before starting game
/*   if (!ui.isNamesFilled(options.playersNumber)) {
       console.log("Fill required options")
       // ui.highlightEmptyInputs()
       return
   }*/