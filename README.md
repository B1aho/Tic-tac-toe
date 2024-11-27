# Tic-tac-toe
## Description:
This project (frontend-heavy) is an advanced Tic-Tac-Toe game featuring both single-player (against AI) and two-player modes, with customizable board sizes of 3x3, 4x4, 5x5, and 6x6. Two gameplay mode available: classic/extended

- Extended gameplay mode introduces unique rules for both single-player and two-player matches. When all pieces have been placed on the board, subsequent moves allow players to shift their oldest pieces to new positions, adding a layer of strategy and unpredictability. This mode challenges players to adapt to dynamic board configurations, making each game unique

- The AI is powered by the Minimax algorithm enhanced with alpha-beta pruning, a transposition table for storing previously analyzed game states, and iterative deepening to refine its decision-making in real-time

- While the AI is theoretically unbeatable on smaller boards, the complexity of larger grids like 5x5 and 6x6 introduces millions of recursive calls per turn (e.g., on a 5x5 board), necessitating optimizations such as time limits per move and heuristic evaluations of non-terminal game states

- These optimizations create some degree of uncertainty in the AI’s play on larger boards, giving players a realistic chance to outsmart it—an element that enhances the challenge and excitement, especially in the 5x5 and 6x6 modes. For a tailored gameplay experience, the game offers four levels of AI difficulty, allowing players of all skill levels to enjoy a dynamic and competitive match

- The project has been refactored for maximum modularity and scalability. Due to this fact it was not hard to integrate new game modes, rules, or UI features. The extended gameplay mode and AI enhancements were seamlessly added without significant compromising the existing code structure, demonstrating the flexibility of the design.

## Screenshots:

## Technology stack and performance:
This project is built with vanilla JavaScript, CSS, and HTML. "A craftsman is only as good as their tools, but a true master knows how to work without them."

### Focus on optimization:
- Although JavaScript is not the ideal language for implementing complex AI algorithms due to its performance limitations compared to lower-level languages like C, my goal was to challenge myself by practicing JavaScript and optimizing the AI to perform as close as possible to the speed and efficiency of implementations in more performant languages
- Creating a competitive, well-optimized AI in JavaScript was an exciting and rewarding challenge

### Enhanced Performance with Web Workers:
- To handle the computationally intensive AI algorithms without blocking the main thread, I implemented Web Workers, offloading heavy calculations to background threads
- This ensures a smooth and responsive UI, even during complex decision-making processes
- By incorporating Web Workers, I also gained valuable experience working with Promises and asynchronous programming, improving both the performance and maintainability of the project

## Notes on AI implementation:
### Minimax + alpha-beta pruning:
### Zobrist hashing + transposition table:
### Iterative deepening (time and depth limits):
### Heuristic method development: 

## Future improvements:
- Add AI levels
- Add AI vs AI game mode
- Add multiplayer game mode
- Add multithreading in minimax
