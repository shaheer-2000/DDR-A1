import { GAMESTATE as GameState, MazeGrid } from "../../types/types";

export default interface MazeObserver {
	update(mazeState: MazeGrid, gameState: GameState): void
}
