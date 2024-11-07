let BenchCount = 0
/*
    5. Захардкодить первые лучшие ходы для аи, и мб некоторые комбинации
    6. Изменять глубину когда применяется эвристическая функция, в зависимости от кол-ва сделанных ходов
*/
// Добавь уровни сложности для ии как тот чел, от рандомных ходов, половина рандомные, а половина минимакс, минимакс с опред. глубиной
// Разбей всё по модулям, после того как доделаешь игру, чекни как правильно рефакторить такой код
// Добавить векторную графику (canvas) 

// Cell module with private value
const defaultSymbol = '*'
const Cell = function () {
    let value = defaultSymbol
    const getValue = () => {
        return value;
    }

    const setValue = (x) => {
        value = x
    }

    return {
        getValue,
        setValue,
    }
}

// Game field with the grid of cells. Object represent all logic about manipulations on the field and private field
const GameField = function (row) {
    const field = []

    const initField = (() => {
        for (let i = 0; i <= row; i++) {
            field[i] = []
            for (let j = 0; j <= row; j++) {
                field[i].push(Cell())
            }
        }
    })()

    const resetField = () => {
        field.forEach(el => el.forEach(cell => cell.setValue(defaultSymbol)))
    }

    const getField = () => field

    // Наверное разумнее чтобы он просто от клетки где был ход пошел поочереди во все стороны
    // Можно сделать так, что три зачеркивания нужно для поля 3х3 и 4х4, для остальный полей 4 зачеркивания
    const checkEnd = (rw, cl) => {
        const token = field[rw][cl].getValue()
        const winLine = row > 2 ? 4 : 3
        // Check win in a row 
        let oneRow = 0
        for (el of field[rw]) {
            if (el.getValue() === token) {
                oneRow++
                if (oneRow >= winLine)
                    return true
            } else {
                oneRow = 0
            }
        }
        // Check win in a column
        let oneColumn = 0
        for (el of field) {
            if (el[cl].getValue() === token) {
                oneColumn++
                if (oneColumn >= winLine)
                    return true
            } else {
                oneColumn = 0
            }
        }
        // Check win in a diagonals
        let mainX = rw
        let mainY = cl
        let mainDiag = 0
        while (mainX > 0 && mainY > 0) {
            mainX--
            mainY--
        }
        for (let i = mainX, j = mainY; i <= row && j <= row; i++, j++) {
            if (field[i][j].getValue() === token) {
                mainDiag++
                if (mainDiag >= winLine)
                    return true
            } else {
                mainDiag = 0
            }
        }

        let secondX = rw
        let secondY = cl
        let secondDiag = 0
        while (secondX < row && secondY > 0) {
            secondX++
            secondY--
        }
        for (let i = secondX, j = secondY; i >= 0 && j <= row; i--, j++) {
            if (field[i][j].getValue() === token) {
                secondDiag++
                if (secondDiag >= winLine)
                    return true
            } else {
                secondDiag = 0
            }
        }
    }

    return {
        getField,
        checkEnd,
        resetField,
    }
}

// Game module. All game loop logic here
const GameControl = function (playerOne = 'Player-One', playerTwo = 'Player-Two', size) {
    const players = [
        {
            playerName: playerOne,
            token: 'X'
        },
        {
            playerName: playerTwo,
            token: 'O'
        }
    ]
    const memo = {}; // Кэширование

    const fieldControl = GameField(size)
    const field = fieldControl.getField()
    let activeTurn = players[0]
    let movesCounter = 0
    // рассчитываем по row
    let minMovesToCheck = 4
    let maxMoves = (size + 1) * (size + 1) - 1
    const getActiveTurn = () => activeTurn

    const turnMove = () => {
        activeTurn = activeTurn === players[0] ? players[1] : players[0]
        movesCounter++
    }

    const checkEnd = (row, col) => {
        if (movesCounter >= minMovesToCheck && fieldControl.checkEnd(Number(row), Number(col))) {
            return "win"
        } else if (movesCounter === maxMoves) {
            return 'draw';
        }
    }

    let depthMax = size >= 3 ? 6 : 100

    const resetGame = () => {
        console.table(field.map(el => el.map(cell => cell.getValue())))
        fieldControl.resetField()
        console.table(field.map(el => el.map(cell => cell.getValue())))
        movesCounter = 0
        depthMax = size > 2 ? 5 : 100
        activeTurn = players[0]
    }

    function getPossibleMoves() {
        const centerRow = Math.floor(size / 2);
        const centerCol = Math.floor(size / 2);
        const moves = [];
        for (let row = 0; row <= size; row++) {
            for (let col = 0; col <= size; col++) {
                if (field[row][col].getValue() === defaultSymbol) {
                    //const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol)
                    const distanceFromCenter = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2))
                    const centerWeight = 5 - distanceFromCenter // Чем ближе к центру, тем выше значение
                    moves.push([row, col, centerWeight])
                }
            }
        }
        return moves;
    }

    // Оценить и отсортировать ходы по их выгодности
    function sortMovesByHeuristic(moves, player) {
        return moves.sort((a, b) => b[2] - a[2]);
        /*
        return moves.sort((a, b) => {
            field[a[0]][a[1]].setValue(player)
            const scoreA = heuristic(player)
            field[a[0]][a[1]].setValue(defaultSymbol)

            field[b[0]][b[1]].setValue(player)
            const scoreB = heuristic(player)
            field[b[0]][b[1]].setValue(defaultSymbol)

            return scoreB - scoreA; // Сортировка по убыванию
        });*/
    }

    const better = (a, b, isMax) => {
        if (isMax) {
            return a > b
        } else
            return a < b
    }
    // Будет получать номер 0 или 1 соответсвующий за кого аи играет
    // isMax можно не передавать, достаточно idx чтобы определить
    const moveAi = (idx, isMax) => {
        if (size >= 3 && movesCounter > 5) {
            depthMax += 1
        }
        let bestScore = isMax ? -Infinity : Infinity
        let bestMove
       // const fieldHash = field.map(row => row.join('')).join(',')
        //if (memo[fieldHash]) {
       //     return memo[fieldHash];
      //  }
        /*  if (movesCounter === 0 && size === 4) {
              bestMove = bestAiMoves.firstIn5
              field[bestMove[0]][bestMove[1]].setValue(players[idx].token)
              return bestMove
          }*/

        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves();
        if (size > 3) {
            possibleMoves = sortMovesByHeuristic(possibleMoves, players[idx].token);
        }

        for (const move of possibleMoves) {
            // Выполнить ход
            field[move[0]][move[1]].setValue(players[idx].token)
    
            // Рекурсивный вызов минимакса
            const score = minimax(1, !isMax, move[0], move[1], -Infinity, Infinity)
            // Откатить ход
            field[move[0]][move[1]].setValue(defaultSymbol)

            // Обновить лучший счёт
            if (better(score, bestScore, isMax)) {
                bestScore = score
                bestMove = [move[0], move[1]]
            }
        }
        /*
                for (let i = 0; i <= size; i++) {
                    for (let j = 0; j <= size; j++) {
                        if (field[i][j].getValue() === defaultSymbol) {
                            field[i][j].setValue(players[idx].token)
                            //movesCounter++
                            console.time("Minimax")
                            let score = minimax(0, !isMax, i, j, -Infinity, Infinity)
                            console.timeEnd("Minimax")
                            field[i][j].setValue(defaultSymbol)
                            //movesCounter--
                            if (better(score, bestScore)) {
                                bestScore = score
                                bestMove = [i, j]
                            }
                        }
                    }
                }*/
        field[bestMove[0]][bestMove[1]].setValue(players[idx].token)
        //  movesCounter = saveMovesCounter
        return bestMove
    }

    const heuristic = (player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        let score = 0;
      //  const centerRow = Math.floor(size / 2);
      //  const centerCol = Math.floor(size / 2);
        // Оценка строк
        for (let row = 0; row < size; row++) {
            for (let col = 0; col <= size - 3; col++) {
                score += evaluateLine([field[row][col], field[row][col + 1], field[row][col + 2], field[row][col + 3]], player, opponent);
            }
        }

        // Оценка столбцов
        for (let col = 0; col < size; col++) {
            for (let row = 0; row <= size - 3; row++) {
                score += evaluateLine([field[row][col], field[row + 1][col], field[row + 2][col], field[row + 3][col]], player, opponent);
            }
        }

        // Проверяем диагонали (слева-направо)
        for (let row = 0; row <= size - 3; row++) {
            for (let col = 0; col <= size - 3; col++) {
                score += evaluateLine([field[row][col], field[row + 1][col + 1], field[row + 2][col + 2], field[row + 3][col + 3]], player, opponent);
            }
        }

        // Проверяем диагонали (справа-налево)
        for (let row = 0; row <= size - 3; row++) {
            for (let col = 3; col < size; col++) {
                score += evaluateLine([field[row][col], field[row + 1][col - 1], field[row + 2][col - 2], field[row + 3][col - 3]], player, opponent)
               /* if (res > 0)
                    score += res + 4
                else if (res < 0)
                    score += res - 4
                else 
                    score += res*/
            }
        }
        /*
        if (size >= 3) {
            // Добавляем поправку на центр
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (field[row][col] === player) {
                        const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
                        score += (4 - distanceFromCenter); // Чем ближе к центру, тем выше бонус
                    } else if (field[row][col] === opponent) {
                        const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
                        score -= (4 - distanceFromCenter); // Наказываем за центр соперника
                    }
                }
            }
        }*/
        return score;
    }

    const evaluateLine = (line, player, opponent) => {
        const winLine = 4
        if (line.filter(cell => cell.getValue() === player).length === winLine) {
            return 10000; // Выигрышная линия для игрока
        } else if (line.filter(cell => cell.getValue() === player).length === winLine - 1 && line.includes(defaultSymbol)) {
            return 500; // Два символа игрока и один пробел
        } else if (line.filter(cell => cell.getValue() === player).length === winLine - 2 && line.includes(defaultSymbol) && line.filter(cell => cell.getValue() === defaultSymbol).length === 2) {
            return 50; // Один символ игрока и два пробела
        } else if (line.filter(cell => cell.getValue() === opponent).length === winLine) {
            return -10000; // Выигрышная линия для соперника
        } else if (line.filter(cell => cell.getValue() === opponent).length === winLine - 1 && line.includes(defaultSymbol)) {
            return -500; // Два символа соперника и один пробел
        } else if (line.filter(cell => cell.getValue() === opponent).length === winLine - 2 && line.includes(defaultSymbol) && line.filter(cell => cell.getValue() === defaultSymbol).length === 2) {
            return -50; // Один символ соперника и два пробела
        }
        return 0; // Нейтральная линия
    }

    const scores = {
        win: 10000,
        lose: -10000,
        draw: 0,
    }

    // Захардкодить лучшие ходы для разных ситуаций, лучше объект, где свойства своим именем поисывают ситуацию для хода
    const bestAiMoves = {
        firstIn3: [],
        firstIn4: [],
        firstIn5: [0, 0],
    }

    const getHash = () => {
        const board = []
        for (let i = 0; i <= size; i++) {
            board[i] = []
            for (let j = 0; j <= size; j++) {
                board[i][j] = field[i][j].getValue()
            }
        }
        return board.map(row => row.join('')).join(',')
    }
    /*
    https://www.youtube.com/watch?v=l-hh51ncgDI
    Осталось ограничить вычисления какой-то глубиной дальше которой минимакс не будет анализировать ходы до победы,
    а будет анализировать их статично, по каким-то другим условиям, чтобы не падала производительность
    https://stackoverflow.com/questions/51427156/how-to-solve-tic-tac-toe-4x4-game-using-minimax-algorithm-and-alpha-beta-pruning
    */
    const minimax = (depth, isMax, rw, cl, alpha, beta) => {
        // Хеширование не работает по причине того, что мне надо преобразовать доску к массиву значениц, а не объектов
        
        const fieldHash = getHash()
        if (memo[fieldHash]) {
            return memo[fieldHash];
        }
          // Закончить игру оценив доску статическим методов
        if (depth >= depthMax) {
            return heuristic(isMax ? 'X' : 'O')
        }
        let result = checkEnd(rw, cl)
        if (result === "win" || result === "draw") {
            if (result === "win") {
                result = !isMax ? "win" : "lose"
            }
            if (result === "win") {
                returnVal = scores[result] - depth
            } else if (result === "lose") {
                returnVal = scores[result] + depth
            } else
                returnVal = scores[result]
            return returnVal
        }
        let bestScore = isMax ? -Infinity : Infinity
        let token = isMax ? players[0].token : players[1].token
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves();
        if (size > 3) {
            possibleMoves = sortMovesByHeuristic(possibleMoves, token);
        }
        for (const move of possibleMoves) {
            BenchCount++
            // Выполнить ход
            field[move[0]][move[1]].setValue(token)
            movesCounter++
            // Рекурсивный вызов минимакса
            const score = minimax(depth + 1, !isMax, move[0], move[1], alpha, beta);

            // Откатить ход
            field[move[0]][move[1]].setValue(defaultSymbol)
            movesCounter--

            // Обновить лучший счёт
            if (isMax) {
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
            } else {
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
            }

            // Альфа-бета обрезка
            if (beta <= alpha) 
                break;
        }

        /*
                for (let i = 0; i <= size; i++) {
                    for (let j = 0; j <= size; j++) {
                        if (field[i][j].getValue() === defaultSymbol) {
                            field[i][j].setValue(token)
                            movesCounter++
                            let score = minimax(depth + 1, !isMax, i, j, alpha, beta)
                            field[i][j].setValue(defaultSymbol)
                            movesCounter--
                            bestScore = isMax ? Math.max(score, bestScore) : Math.min(score, bestScore)
                            if (isMax)
                                alpha = Math.max(alpha, score)
                            else
                                beta = Math.min(score, beta)
                            if (beta <= alpha) {
                                breakCheck = true
                                break
                            }
                        }
                    }
                    if (breakCheck) {
                        break
                    }
                }
                    */
        memo[fieldHash] = bestScore;
        return bestScore
    }

    return {
        turnMove,
        checkEnd,
        resetGame,
        field,
        getActiveTurn,
        moveAi,
    }
}

const PlayScreenControl = function (firstPlayerName, secondPlayerName, row) {
    const fieldContainer = document.querySelector('.field')
    const playScreen = document.querySelector('.play-screen')
    const playerOneDiv = document.querySelector('#player-1')
    const playerTwoDiv = document.querySelector('#player-2')
    const moveDescription = document.querySelector('#move')
    const resetBtn = document.querySelector('#reset')
    const backBtn = document.querySelector('#back')
    let gameActiveState = true
    const game = GameControl(firstPlayerName, secondPlayerName, row)
    const field = game.field

    const getToken = () => game.getActiveTurn().token

    // Функция рендерит игровое поле, как грид
    let cols = row
    const renderField = () => {
        const fieldWrap = document.createElement("div")
        fieldWrap.id = "field-wrapper"
        fieldContainer.append(fieldWrap)
        let rows = 0
        field.forEach(el => {
            let columns = 0
            for (let cell of el) {
                const btn = document.createElement('div')
                btn.innerText = cell.getValue()
                btn.role = 'button'
                btn.className = 'cell'
                btn.dataset.column = columns++
                btn.dataset.row = rows
                if (columns === cols + 1)
                    columns = 0
                fieldWrap.append(btn)
            }
            rows++
        })
        fieldWrap.style.display = 'grid'
        fieldWrap.style.gridTemplateColumns = `repeat(${cols + 1}, 1fr)`
        fieldWrap.addEventListener('click', handleClick)
    }

    // Update data and render on click if have changes
    const handleClick = (e) => {
        if (gameActiveState) {
            const target = e.target
            const token = getToken()
            const coords = target.dataset
            const row = coords.row
            const col = coords.column
            if (target.innerText !== defaultSymbol)
                return;
            // update field data
            field[row][col].setValue(token)
            // update cell rendering
            target.innerText = token
            // Check end
            let result = game.checkEnd(row, col)
            game.turnMove()
            controlMove(result)
            // Блокируем клик, если один игрок
            if (typeof aiStrategy !== "undefined" && typeof result === "undefined") {
                makeAiMove()
            }
        }
    }

    // Change player's name into Cross player;s name and noliki player's name
    const renderPlayers = () => {
        nameDivOne = document.createElement("div")
        nameDivOne.id = "player-name-div-1"
        nameDivOne.innerText = `First player's name: ${firstPlayerName}`

        nameDivTwo = document.createElement("div")
        nameDivTwo.id = "player-name-div-2"
        nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

        playerOneDiv.prepend(nameDivOne)
        playerTwoDiv.prepend(nameDivTwo)
    }

    const resetField = () => {
        const cells = document.querySelectorAll('.cell')
        cells.forEach((cell) => cell.innerText = defaultSymbol)
    }

    const handleReset = () => {
        game.resetGame()
        resetField()
        controlMove(false)
        gameActiveState = true
        if (game.getActiveTurn().playerName === "AI") {
            makeAiMove()
        }
        BenchCount = 0
    }

    // Нужно удалить всё что тут было нарисовано и отключить слушатели
    // плей сркин рисовать придется каждый раз заново, так как разнын настройки
    const handleBack = () => {
        fieldContainer.removeEventListener('click', handleClick)
        resetBtn.removeEventListener('click', handleReset)
        backBtn.removeEventListener('click', handleBack)
        fieldWrap = document.querySelector("#field-wrapper")
        nameDivOne = document.querySelector("#player-name-div-1")
        nameDivTwo = document.querySelector("#player-name-div-2")
        optionScreen = document.querySelector(".option-screen")
        fieldWrap.remove()
        nameDivOne.remove()
        nameDivTwo.remove()
        playScreen.style.display = "none"
        optionScreen.style.display = "block"
    }

    // Сделать просто changeMove, и добавлять аттрибут актив терн, чтобы подсвечивать рамку
    const controlMove = (isEnd) => {
        if (isEnd === 'win') {
            game.turnMove()
            moveDescription.innerText = `${game.getActiveTurn().playerName} is the winner. Congratulation!`
            gameActiveState = false
        } else if (isEnd === 'draw') {
            moveDescription.innerText = `Draw. No one lose..`
            gameActiveState = false
        } else {
            moveDescription.innerText = `It is now ${game.getActiveTurn().playerName}'s turn!`
        }
    }

    const renderAiMove = (coords) => {
        const col = coords[1]
        const row = coords[0]
        document.querySelector(`[data-column=${CSS.escape(col)}][data-row=${CSS.escape(row)}]`).innerText = getToken()
    }

    // Выбираем стратегию для компьютера в алгоритме minmax, а также блокируем клик на первый ход, если компьютер крестик
    let aiStrategy
    let aiIdx

    const makeAiMove = () => {
        gameActiveState = false
        console.time("Ai move")
        const aiCoords = game.moveAi(aiIdx, aiStrategy === "max" ? true : false)
        console.timeEnd("Ai move")
        renderAiMove(aiCoords)
        console.log(BenchCount)
        result = game.checkEnd(aiCoords[0], aiCoords[1])
        game.turnMove()
        controlMove(result)
        gameActiveState = result === "win" || result === "draw" ? false : true
    }

    playScreen.style.display = 'block'
    renderPlayers()
    renderField()
    controlMove(false)
    resetBtn.addEventListener('click', handleReset)
    backBtn.addEventListener('click', handleBack)

    if (firstPlayerName === "AI" || secondPlayerName === "AI") {
        aiStrategy = firstPlayerName === "AI" ? "max" : "min"
        aiIdx = aiStrategy === "max" ? 0 : 1
        if (aiStrategy === "max") {
            makeAiMove()
        }
    }
}

OptionScreenControl = function () {
    const playBtn = document.querySelector(".play-btn")
    const xInput = document.querySelector("#player-x-input")
    const oInput = document.querySelector("#player-o-input")
    const choosePlayers = document.querySelector(".players-radio")
    const optionScreen = document.querySelector(".option-screen")
    const handlePlay = () => {
        const row = document.querySelector('input[name="field"]:checked').value
        const players = Number(document.querySelector('input[name="players-number"]:checked').value)
        if (haveNames(players)) {
            console.log('have names')
            optionScreen.style.display = "none"
            xInput.value = xInput.value === "" ? "AI" : xInput.value
            oInput.value = oInput.value === "" ? "AI" : oInput.value
            PlayScreenControl(xInput.value, oInput.value, Number(row) - 1)
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
}

OptionScreenControl()