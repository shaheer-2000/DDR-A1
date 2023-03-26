import { MazeGrid, Point, DIRECTION as Direction, STATE as State, GAMESTATE as GameState } from "../../types/types";
import MazeObserver from "../rendering/MazeObserver";
import PathFinder from "./PathFinder";

export default class DFSPathFinder implements PathFinder {
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

	private getDirectionsRandomly(): Direction[] {
		const directions: Direction[] = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
		const shuffledDirections: Direction[] = [];
		for (let i = 0, len = directions.length; i < len; i++) {
			const randDirIdx = ~~(Math.random() * directions.length);
			shuffledDirections.push(directions[randDirIdx]);
			directions.splice(randDirIdx, 1);
		}

		return shuffledDirections;
	}

	public findPath(maze: MazeGrid, rowCount: number, colCount: number, currPoint: Point, observers?: MazeObserver[]): GameState {
		if (!this._startPoint) {
			throw Error();
		}

		const stack = [currPoint];

		while (stack.length > 0) {
			const sourcePoint = stack.pop();
			if (sourcePoint === undefined) {
				break;
			}
			const [i, j] = sourcePoint;
			const directions = this.getDirectionsRandomly();

			if (i >= rowCount || i < 0 || j >= colCount || j < 0) {
				continue;
			}

			if (maze[i][j] === State.END) {
				// if (observers !== undefined) this.notify(observers, maze, GameState.SOLVED);
				return GameState.SOLVED;
			}

			if (maze[i][j] === State.BLOCKED || maze[i][j] === State.VISITED) {
				continue;
			}
	
			maze[i][j] = State.VISITED;

			if (observers !== undefined) this.notify(observers, maze, GameState.SOLVING);

			for (let direction of directions) {
				switch (direction) {
					case Direction.NORTH:
						stack.push([i - 1, j]);
						break;
					case Direction.EAST:
						stack.push([i, j + 1]);
						break;
					case Direction.SOUTH:
						stack.push([i + 1, j]);
						break;
					case Direction.WEST:
						stack.push([i, j - 1]);
						break;
				}
			}
		}

		return GameState.NO_SOLUTION;
	}
};