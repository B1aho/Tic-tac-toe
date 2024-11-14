# Tic-tac-toe with 1-player(Smart AI-agent)/2-players modes
## Description:
This project is an advanced Tic-Tac-Toe game featuring both single-player (against AI) and two-player modes, with customizable board sizes of 3x3, 4x4, 5x5, and 6x6. 

The AI is powered by the Minimax algorithm enhanced with alpha-beta pruning, a transposition table for storing previously analyzed game states, and iterative deepening to refine its decision-making in real-time. 

While the AI is theoretically unbeatable on smaller boards, the complexity of larger grids like 5x5 and 6x6 introduces millions of recursive calls per turn (e.g., on a 5x5 board), necessitating optimizations such as time limits per move and heuristic evaluations of non-terminal game states.

These optimizations create some degree of uncertainty in the AI’s play on larger boards, giving players a realistic chance to outsmart it—an element that enhances the challenge and excitement, especially in the 5x5 and 6x6 modes. For a tailored gameplay experience, the game offers four levels of AI difficulty, allowing players of all skill levels to enjoy a dynamic and competitive match

## Notes on AI implementation:
### Minimax + alpha-beta pruning:
### Zobrist hashing + transposition table:
### Iterative deepening (time and depth limits):
### Heuristic method development: 
### Performance:

## Future improvements:
