import { MazeGrid, Point, GAMESTATE as GameState } from "../../types/types";
import MazeObserver from "../rendering/MazeObserver";

export default interface PathFinder {
	startPoint: Point,
	findPath(maze: MazeGrid, rowCount: number, colCount: number, currPoint: Point, observers?: MazeObserver[]): GameState;
};
