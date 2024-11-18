// Возможно экрану не надо ничего получать, он если запсукается, то имена берет из инпутов и потом очищает их. 
// Еще можно добавить флаг АИ. Если он указан то импортируем АИ 
const fieldContainer = document.querySelector('.field')
export const playScreen = document.querySelector('.play-screen')
const playerOneDiv = document.querySelector('#player-1')
const playerTwoDiv = document.querySelector('#player-2')
export const moveDescription = document.querySelector('#move')
export const resetBtn = document.querySelector('#reset')
export const backBtn = document.querySelector('#back')

export const renderField = (size) => {
    const fieldWrap = document.createElement("div")
    fieldWrap.id = "field-wrapper"
    fieldContainer.append(fieldWrap)

    for (let rows = 0; rows < size; rows++) {
        for (let columns = 0; columns < size; columns++) {
            const btn = document.createElement('div')
            btn.innerText = '*'
            btn.role = 'button'
            btn.className = 'cell'
            btn.dataset.column = columns++
            btn.dataset.row = rows
            if (columns === size + 1)
                columns = 0
            fieldWrap.append(btn)
        }
    }
    fieldWrap.style.display = 'grid'
    fieldWrap.style.gridTemplateColumns = `repeat(${size + 1}, 1fr)`
}


// Change player's name into Cross player;s name and noliki player's name
export const renderPlayers = (firstPlayerName, secondPlayerName) => {
    const nameDivOne = document.createElement("div")
    nameDivOne.id = "player-name-div-1"
    nameDivOne.innerText = `First player's name: ${firstPlayerName}`

    const nameDivTwo = document.createElement("div")
    nameDivTwo.id = "player-name-div-2"
    nameDivTwo.innerText = `Second player's name: ${secondPlayerName}`

    playerOneDiv.prepend(nameDivOne)
    playerTwoDiv.prepend(nameDivTwo)
}
