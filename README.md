# Tic-tac-toe
## Description:
This project (frontend-heavy) is an advanced Tic-Tac-Toe game featuring both single-player (against AI) and two-player modes, with customizable board sizes of 3x3, 4x4, 5x5, and 6x6. Two gameplay modes available (classic and extended):
- Extended gameplay mode introduces unique rules for both single-player and two-player matches. When all pieces have been placed on the board, subsequent moves allow players to shift their oldest pieces to new positions, adding a layer of strategy and unpredictability. This mode challenges players to adapt to dynamic board configurations, making each game unique
- The AI is powered by the Minimax algorithm enhanced with alpha-beta pruning, a transposition table for storing previously analyzed game states, and iterative deepening to refine its decision-making in real-time
- While the AI is theoretically unbeatable on smaller boards, the complexity of larger grids like 5x5 and 6x6 introduces millions of recursive calls per turn (e.g., on a 5x5 board), necessitating optimizations such as time limits per move and heuristic evaluations of non-terminal game states
- These optimizations create some degree of uncertainty in the AI’s play on larger boards, giving players a realistic chance to outsmart it—an element that enhances the challenge and excitement, especially in the 5x5 and 6x6 modes. For a tailored gameplay experience, the game offers four levels of AI difficulty, allowing players of all skill levels to enjoy a dynamic and competitive match
- The project has been refactored for maximum modularity and scalability. Due to this fact it was not hard to integrate new game modes, rules, or UI features. The extended gameplay mode and AI enhancements were seamlessly added without significant compromising the existing code structure, demonstrating the flexibility of the design.

## Screenshots:
<img width="490" alt="Screenshot_2" src="https://github.com/user-attachments/assets/74b4aa15-85ba-4728-a347-93d9c25edfd2">
<img width="490" alt="Screenshot_3" src="https://github.com/user-attachments/assets/62edb3c5-c785-4a30-b907-313d2a1987f0">
<img width="490" alt="Screenshot_4" src="https://github.com/user-attachments/assets/794a1323-8cad-4be1-b6cb-36176836f927">
<img width="490" alt="Screenshot_5" src="https://github.com/user-attachments/assets/c3018a69-a74d-42bf-b0ad-9853e0ffb575">


## Technology stack and performance:
This project is built with vanilla JavaScript, CSS, and HTML. "A craftsman is only as good as their tools, but a true master knows how to work without them."

### Focus on optimization:
- Although JavaScript is not the ideal language for implementing complex AI algorithms due to its performance limitations compared to lower-level languages like C, my goal was to challenge myself by practicing JavaScript and optimizing the AI to perform as close as possible to the speed and efficiency of implementations in more performant languages
- Creating a competitive, well-optimized AI in JavaScript was an exciting and rewarding challenge
### Enhanced Performance with Web Workers:
- To handle the computationally intensive AI algorithms without blocking the main thread, I implemented Web Workers, offloading heavy calculations to background threads
- This ensures a smooth and responsive UI, even during complex decision-making processes
- By incorporating Web Workers, I also gained valuable experience working with Promises and asynchronous programming, improving both the performance and maintainability of the project
### Responsive
- The project includes media queries and other responsive design techniques, ensuring the game works on mobile devices as well as desktops.

## Notes on AI implementation:
### Minimax + alpha-beta pruning:
- The minimax algorithm is used to evaluate game states by simulating all possible moves to determine the optimal strategy for both players. Alpha-beta pruning is applied to minimize the number of nodes evaluated by eliminating branches that cannot influence the final decision.
- These techniques help the AI find optimal moves efficiently, even with a high branching factor.
### Zobrist hashing + transposition table:
- Zobrist hashing assigns unique hash values to game states, enabling the detection of previously analyzed positions. These hashes are stored in a transposition table to avoid redundant calculations.
- Hash keys are computed incrementally, ensuring quick updates when moves are made or undone. The transposition table records the depth of analysis to prioritize deeper evaluations, ensuring better accuracy over repeated plays.
### Iterative deepening (time and depth limits):
- The algorithm progressively increases the depth of its search, ensuring that results are available even under tight time constraints.
- This method ensures that the AI can return a valid move within a predefined time limit, even if it cannot fully explore the game tree.
- The algorithm handles interruptions by always storing the best result found at the last completed depth. Time limits are carefully managed to balance move quality and responsiveness.
### Heuristic method development: 
- The heuristic evaluates non-terminal game states by assigning scores based on potential winning lines, blocking opportunities, and positional advantages.
- Heuristics guide the AI in prioritizing promising branches of the game tree, especially in larger boards where exhaustive searches are infeasible.
## Future improvements:
### Multiplayer
Add a multiplayer mode to allow players to compete against each other online. This would involve implementing real-time game synchronization and a lobby system for matchmaking.
### Multithreading
Optimize the AI by parallelizing the minimax algorithm using Web Workers. This would significantly reduce computation time for large boards or deeper searches, enhancing the AI's responsiveness and scalability.
### Customizable Player Features
Introduce options for players to upload custom images for game pieces and avatars. This feature would enhance personalization and improve the overall user experience.
