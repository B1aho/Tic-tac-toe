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

    const fieldControl = GameField(size)
    const field = fieldControl.getField()

    // https://en.wikipedia.org/wiki/Zobrist_hashing
    // Добавить всё что с аи в отдельный модуль, можно внутри гейм контрол мб, он будет активироваться, только если 
    // выбрана игра с аи. Загуглить норма практика ли модуль в модуле

    // Инициализируем уникальные хэши для каждого состояния клетки, т.е. получаем задаем по три хэш на каждую клетку
    const zobristTable = Array.from({ length: size + 1 }, () =>
        Array.from({ length: size + 1 }, () => ({
            'X': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            'O': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            '*': Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        }))
    )

    // Получаем первый хэш для доски   
    const initHash = () => {
        let hash = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = field[row][col];
                if (cell.getValue() === 'X') {
                    hash ^= zobristTable[row][col]["X"];
                } else if (cell.getValue() === 'O') {
                    hash ^= zobristTable[row][col]["O"];
                } else {
                    hash ^= zobristTable[row][col]["*"];
                }
            }
        }
        return hash;
    }

    let initialHash = initHash()

    // Обновляем хэш для каждого вызова: Откатываем хэш предыдущего ход и вычисляем новый 


    // Транспозиционная таблица для хранения хэшей
    const transpositionTable = new Map();

    //@type value can be exact, upperBound or lowerBound for correct working with alpha-beta puring
    const storeTransposition = (hash, depth, bestScore, type, isMax) => {
        const val = transpositionTable.get(hash)
        // Всё работает, если сохраняем глубокие от 5
        if (typeof val === "undefined" && depth >= 5) {
            transpositionTable.set(hash, { depth, bestScore, type, isMax })
        } else if (typeof val !== "undefined" && depth >= 5) {
            transpositionTable.set(hash + 1, { depth, bestScore, type, isMax })
        }
    }

    const getTransposition = (hash) => {
        return transpositionTable.get(hash);
    }

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

    let depthMax = size >= 3 ? 7 : 100

    const resetGame = () => {
        console.table(field.map(el => el.map(cell => cell.getValue())))
        fieldControl.resetField()
        console.table(field.map(el => el.map(cell => cell.getValue())))
        movesCounter = 0
        depthMax = size >= 3 ? 7 : 100
        activeTurn = players[0]
        initialHash = initHash()
        console.log(initialHash)
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
        if (size === 4) {
            if (movesCounter === 0 || movesCounter === 1 && field[2][2].getValue() === defaultSymbol) {
                let move = bestAiMoves.firstIn5
                field[move[0]][move[1]].setValue(players[idx].token)
                initialHash ^= zobristTable[move[0]][move[1]][players[idx].token]
                return move
            } else if (movesCounter === 1) {
                let move = bestAiMoves.secondIn5
                field[move[0]][move[1]].setValue(players[idx].token)
                initialHash ^= zobristTable[move[0]][move[1]][players[idx].token]
                return move

            }
        }
        let bestScore = isMax ? -Infinity : Infinity
        let bestMove

        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves();
        if (size >= 3) {
            possibleMoves = sortMovesByHeuristic(possibleMoves, players[idx].token);
        }

        for (const move of possibleMoves) {
            // Выполнить ход
            field[move[0]][move[1]].setValue(players[idx].token)
            //   initialHash = updateHash(initialHash, move[0], move[1], prevToken, players[idx].token)
            initialHash ^= zobristTable[move[0]][move[1]][players[idx].token]
            // Рекурсивный вызов минимакса
            const score = minimax(1, !isMax, move[0], move[1], -Infinity, Infinity, initialHash)
            // Откатить ход
            field[move[0]][move[1]].setValue(defaultSymbol)
            initialHash ^= zobristTable[move[0]][move[1]][players[idx].token]
            // Обновить лучший счёт
            if (better(score, bestScore, isMax)) {
                bestScore = score
                bestMove = [move[0], move[1]]
            }
        }

        field[bestMove[0]][bestMove[1]].setValue(players[idx].token)
        initialHash ^= zobristTable[bestMove[0]][bestMove[1]][players[idx].token]
        //  movesCounter = saveMovesCounter
        return bestMove
    }

    const heuristic = (player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        let score = 0;
        //  const centerRow = Math.floor(size / 2);
        //  const centerCol = Math.floor(size / 2);
        // Оценка строк
        if (size === 4) {
            for (let row = 0; row < size; row++) {
                score += evaluateLine([field[row][0], field[row][1], field[row][2], field[row][3], field[row][4]], player, opponent);

            }

            // Оценка столбцов
            for (let col = 0; col < size; col++) {
                score += evaluateLine([field[0][col], field[1][col], field[2][col], field[3][col], field[4][col]], player, opponent);
            }
        } else if (size === 3) {
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
        }
        // Проверяем диагонали (слева-направо)
        for (let row = 0; row <= size - 3; row++) {
            for (let col = 0; col <= size - 3; col++) {
                score += evaluateLine([field[row][col], field[row + 1][col + 1], field[row + 2][col + 2], field[row + 3][col + 3]], player, opponent)
            }
        }

        // Проверяем диагонали (справа-налево)
        for (let row = 0; row <= size - 3; row++) {
            for (let col = 3; col < size; col++) {
                score += evaluateLine([field[row][col], field[row + 1][col - 1], field[row + 2][col - 2], field[row + 3][col - 3]], player, opponent)
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
            return 1000; // Два символа игрока и один пробел
        } else if (line.filter(cell => cell.getValue() === player).length === winLine - 2 && line.includes(defaultSymbol) && line.filter(cell => cell.getValue() === defaultSymbol).length === 2) {
            return 100; // Один символ игрока и два пробела
        } else if (
            line.length >= 5 &&
            line[0].getValue() === defaultSymbol &&
            line[1].getValue() === opponent &&
            line[2].getValue() === defaultSymbol &&
            line[3].getValue() === opponent &&
            line[4].getValue() === defaultSymbol
        ) {
            return -10000; // Необходима блокировка угрозы
        }
        else if (line.filter(cell => cell.getValue() === opponent).length === winLine) {
            return -10000; // Выигрышная линия для соперника
        } else if (line.filter(cell => cell.getValue() === opponent).length === winLine - 1 && line.includes(defaultSymbol)) {
            return -1000; // Два символа соперника и один пробел
        } else if (line.filter(cell => cell.getValue() === opponent).length === winLine - 2 && line.includes(defaultSymbol) && line.filter(cell => cell.getValue() === defaultSymbol).length === 2) {
            return -100; // Один символ соперника и два пробела
        }  // Новое условие: два символа соперника с пробелом между ними и пробелами по бокам
        return 0; // Нейтральная линия
    }

    const scores = {
        win: 15000,
        lose: -15000,
        draw: 0,
    }

    // Захардкодить лучшие ходы для разных ситуаций, лучше объект, где свойства своим именем поисывают ситуацию для хода
    const bestAiMoves = {
        firstIn3: [],
        firstIn4: [1, 1],
        firstIn5: [2, 2],
        secondIn5: [1, 1]
    }

    /*
    https://www.youtube.com/watch?v=l-hh51ncgDI
    Осталось ограничить вычисления какой-то глубиной дальше которой минимакс не будет анализировать ходы до победы,
    а будет анализировать их статично, по каким-то другим условиям, чтобы не падала производительность
    https://stackoverflow.com/questions/51427156/how-to-solve-tic-tac-toe-4x4-game-using-minimax-algorithm-and-alpha-beta-pruning
    */
    const minimax = (depth, isMax, rw, cl, alpha, beta, hash) => {
        // Проверка транспозиционной таблицы
        // Не работает с кешированием
        let cached = getTransposition(hash);
        // Хуже стало как будто
        if (cached && cached.isMax !== isMax) {
            cached = getTransposition(hash + 1)
        }
        if (cached) {
            if (cached.type === "exact") {
                return cached.bestScore
            } else if (cached.type === "lowerBound" && cached.bestScore > alpha) {
                alpha = cached.bestScore
            } else if (cached.type === "upperBound" && cached.bestScore < beta) {
                beta = cached.bestScore
            }
            if (alpha >= beta) return cached.bestScore
        }
        let breakFlag = false
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

        // Закончить игру оценив доску статическим методов
        if (depth >= depthMax) {
            return heuristic(isMax ? 'X' : 'O')
        }
        let undoHashMove = []
        let bestScore = isMax ? -Infinity : Infinity
        let token = isMax ? players[0].token : players[1].token
        let entryType = "exact"
        // Генерация и сортировка возможных ходов
        let possibleMoves = getPossibleMoves();
        if (size > 3) {
            possibleMoves = sortMovesByHeuristic(possibleMoves, token);
        }
        for (const move of possibleMoves) {
            BenchCount++
            // Выполнить ход
            initialHash ^= zobristTable[move[0]][move[1]][token]
            field[move[0]][move[1]].setValue(token)
            movesCounter++

            // Рекурсивный вызов минимакса
            const score = minimax(depth + 1, !isMax, move[0], move[1], alpha, beta, initialHash);

            // Откатить ход
            field[move[0]][move[1]].setValue(defaultSymbol) // prevToken
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
            if (beta <= alpha) {
                // Определяем тип записи для текущей позиции перед её сохранением
                if (score <= alpha) entryType = "upperBound";
                else if (score >= beta) entryType = "lowerBound";
                breakFlag = true
                undoHashMove = move
                break
            }
            initialHash ^= zobristTable[move[0]][move[1]][token]
        }

        // Сохраняем в транспозиционную таблицу
        storeTransposition(initialHash, depth, bestScore, entryType, isMax);
        if (breakFlag) initialHash ^= zobristTable[undoHashMove[0]][undoHashMove[1]][token]

        return bestScore
    }

    return {
        turnMove,
        checkEnd,
        resetGame,
        field,
        getActiveTurn,
        moveAi,
        initialHash,
        //   updateHash,
        zobristTable,
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
            // update zobrist transposotion table
            //game.initialHash = game.updateHash(game.initialHash, row, col, defaultSymbol ,token)
            game.initialHash ^= game.zobristTable[row][col][token]
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
        BenchCount = 0
        game.resetGame()
        resetField()
        controlMove(false)
        gameActiveState = true
        if (game.getActiveTurn().playerName === "AI") {
            makeAiMove()
        }
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
        BenchCount = 0
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