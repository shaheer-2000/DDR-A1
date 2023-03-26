import { MazeGrid, Point, STATE as State, GAMESTATE as GameState } from "../../types/types";
import MazeObserver from "../rendering/MazeObserver";
import PathFinder from "./PathFinder";

export default class DefaultPathFinder implements PathFinder {
	private _startPoint?: Point;
	constructor() {}

	public set startPoint(startPoint: Point) {
		this._startPoint = startPoint;
	}

	private notify(observers: MazeObserver[], maze: MazeGrid, gameState: GameState) {
		for (let observer of observers) {
			observer.update(maze, gameState);
		}
	}

	public findPath(maze: MazeGrid, rowCount: number, colCount: number, currPoint: Point, observers?: MazeObserver[]): GameState {
		if (!this._startPoint) {
			throw Error();
		}

		const [i, j] = currPoint;
		if (i >= rowCount || i < 0 || j >= colCount || j < 0) {
			return GameState.BACKTRACKING;
		}

		if (maze[i][j] === State.END) {
			// if (observers !== undefined) this.notify(observers, maze, GameState.SOLVED);
			return GameState.SOLVED;
		}

		if (maze[i][j] === State.BLOCKED || maze[i][j] === State.VISITED) {
			return GameState.BACKTRACKING;
		}

		maze[i][j] = State.VISITED;

		if (observers !== undefined) this.notify(observers, maze, GameState.SOLVING);

		if (
			this.findPath(maze, rowCount, colCount, [i - 1, j]) === GameState.SOLVED ||
			this.findPath(maze, rowCount, colCount, [i + 1, j]) === GameState.SOLVED ||
			this.findPath(maze, rowCount, colCount, [i, j - 1]) === GameState.SOLVED ||
			this.findPath(maze, rowCount, colCount, [i, j + 1]) === GameState.SOLVED
		)
			return GameState.SOLVED;


		maze[i][j] = (i === this._startPoint[0] && j === this._startPoint[1]) ? State.START : State.OPEN;

		if (observers !== undefined) this.notify(observers, maze, GameState.SOLVING);

		return GameState.NO_SOLUTION;
	}
};