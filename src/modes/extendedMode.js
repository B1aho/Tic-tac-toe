import { getSharedState } from "../sharedState.js";
import { ui } from "../ui.js";
import { game } from "../game.js";

const state = getSharedState()

export function addExtendedState() {
  state.currentMoves = { X: [], O: [] }
  state.winLength = Number(state.size) === 3 ? 3 : 4
  state.updateMovesQueue = updateMovesQueue
}

export function updateMovesQueue(move, token) {
  const { currentMoves, winLength } = state
  let lastMove = null
  // Если количество ходов превышает максимально допустимое (выигрышную линию), перемещаем последний ход
  if (currentMoves[token].length + 1 > winLength) {
    // Перемещаем последний ход
    lastMove = currentMoves[token].shift()
    // Удаляем предыдущий ход с доски и в интерфейсе
    game.removeMove(lastMove)
    if (!state.isInMinimax) // Добавить флаг
      ui.unrenderMove(lastMove)
    currentMoves[token].push(move)  // Добавляем новый ход на место
  } else {
    // Добавляем ход в очередь для текущего игрока
    currentMoves[token].push(move)
  }
  return lastMove
}
