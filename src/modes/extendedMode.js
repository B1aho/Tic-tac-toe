import { getSharedState } from "../sharedState.js";
import { ui } from "../ui.js";
import { game } from "../game.js";

const state = getSharedState()

export function addExtendedState() {
  state.currentMoves = { X: [], O: [] }
  state.winLength = Number(state.size) === 3 ? 3 : 4
}

export function updateMovesQueue(move) {
  const { currentMoves, winLength } = state
  const player = state.currentPlayer.token
  // Если количество ходов превышает максимально допустимое (выигрышную линию), перемещаем последний ход
  if (currentMoves[player].length + 1 > winLength) {
    // Перемещаем последний ход
    const lastMove = currentMoves[player].shift()
    // Удаляем предыдущий ход с доски и в интерфейсе
    game.removeMove(lastMove)
    ui.unrenderMove(lastMove)
    currentMoves[player].push(move)  // Добавляем новый ход на место
  } else {
    // Добавляем ход в очередь для текущего игрока
    currentMoves[player].push(move)
  }
}
