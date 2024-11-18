const checkEnd = (rw, cl) => {
    const token = field[rw][cl].getValue()
    const winLine = row > 2 ? 4 : 3
    // Check win in a row 
    let oneRow = 0
    for (let el of field[rw]) {
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
    for (let el of field) {
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