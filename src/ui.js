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
    }
}