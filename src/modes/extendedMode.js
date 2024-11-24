import { getSharedState } from "../sharedState.js"
const state = getSharedState()

export function addExtendedState() {
    state.currentMoves = { X: [], O: [] }
    state.winLength = size === 3 ? 3 : 4
  }
  
  export function updateState(move) {
    // Добавляем ход игрока
    state.currentMoves[state.currentPlayer.token] = updateMovesQueue(
      state.currentMoves[state.currentPlayer.token],
      move,
      state.winLength
    )
  
    // Обновляем игровую доску
    state.field[move[0]][move[1]] = player
  
    return state
  }

  function updateMovesQueue(move) {
    const player = state.currentPlayer.token
    const { currentMoves, winLength } = state;
  
    // Добавляем ход в очередь для текущего игрока
    currentMoves[player].push(move);
  
    // Если количество ходов превышает максимально допустимое (выигрышную линию), перемещаем последний ход
    if (currentMoves[player].length > winLength) {
      // Перемещаем последний ход
      const lastMove = currentMoves[player].pop();
      const newMove = findNewMoveForLast(lastMove, state);  // Эта функция должна определить новое место для перемещенного хода
      currentMoves[player].push(newMove);  // Добавляем новый ход на место
    }
  }
  
  // Примерная реализация findNewMoveForLast
  function findNewMoveForLast(lastMove, state) {
    // На основе логики игры, можно найти подходящее место для перемещения хода
    // Например, можно переместить на последнее пустое место на поле
    const emptyCells = getEmptyCells(state.board); // Получаем все пустые клетки
    return emptyCells[emptyCells.length - 1]; // Например, перемещаем на последнюю пустую клетку
  }
  
  // Вспомогательная функция для поиска пустых клеток на поле
  function getEmptyCells(board) {
    const emptyCells = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (!board[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }
  
  
  export function checkWin(player) {
    // Проверяем победу только по текущим ходам игрока
    return isWinningState(state.currentMoves[player], state.winLength)
  }
  