import { STATE as State, Point, MazeGrid, GAMESTATE as GameState } from "../../types/types";
import PathFinder from "../pathFinding/PathFinder";
import MazeObserver from "../rendering/MazeObserver";

// TODO: figure out what to do with the constants

export default class Maze {
	private _pathFinder: PathFinder | null = null;
	private _startPoint: Point = [-1, -1];
	private maze?: MazeGrid;
	private readonly defaultHurdleRatio: number = 1 / 3;
	private readonly hurdleProbabiltyThreshold: number = 0.4;
	private _rowCount: number = 3;
	private _colCount: number = 3;
	private _observers: MazeObserver[] = [];

	constructor(pathFinder: PathFinder, rowCount?: number, colCount?: number, hurdleRatio?: number) {
		this._pathFinder = pathFinder;
		this.generateMaze(
			rowCount ?? this._rowCount,
			colCount ?? this._colCount,
			hurdleRatio ? (hurdleRatio >= 1 ? this.defaultHurdleRatio : hurdleRatio) : this.defaultHurdleRatio);
	}

	public get startPoint() {
		return this._startPoint;
	}

	public set pathFinder(pathFinder: PathFinder) {
		this._pathFinder = pathFinder;
	}

	public set rowCount(rowCount: number) {
		this._rowCount = rowCount;
	}

	public set colCount(colCount: number) {
		this._colCount = colCount;
	}

	public get mazeState() {
		return this.maze;
	}

	public addObserver(observer: MazeObserver) {
		this._observers.push(observer);
	}

	public generateMaze(rowCount: number, colCount: number, hurdleRatio: number): void {
		this._rowCount = rowCount;
		this._colCount = colCount;

		const maze: MazeGrid = [];
		let hurdleCount = 0;

		for (let i = 0; i < this._rowCount; i++) {
			maze.push([]);
			for (let j = 0; j < this._colCount; j++) {
				const hurdleSpread = (this._rowCount * this._colCount) / (hurdleRatio);
				if (hurdleCount >= hurdleSpread) {
					maze[i][j] = State.OPEN;
				} else {
					const hurdleProb = Math.random();
					if (hurdleProb > this.hurdleProbabiltyThreshold) {
						hurdleCount++;
						maze[i][j] = State.BLOCKED;
					} else {
						maze[i][j] = State.OPEN;
					}
				}
			}
		}

		let randomRow = ~~(Math.random() * this._rowCount);
		let randomCol = ~~(Math.random() * this._colCount);
		this._startPoint = [randomRow, randomCol];
		maze[this._startPoint[0]][this._startPoint[1]] = State.START;

		do {
			randomRow = ~~(Math.random() * this._rowCount);
			randomCol = ~~(Math.random() * this._colCount);
		} while (randomRow === this._startPoint[0] && randomCol === this._startPoint[1]);
		maze[randomRow][randomCol] = State.END;

		for (let observer of this._observers) {
			observer.update(maze, GameState.UNSOLVED);
		}

		this.maze = maze;
	}

	// TODO: remove after debugging
	public displayMaze(): void {
		if (!this.maze) {
			throw Error();
		}

		for (let i = 0; i < this._rowCount; i++) {
			console.log(this.maze[i].map(v => {
				switch (v) {
					case State.BLOCKED:
						return "B";
					case State.END:
						return "E";
					case State.START:
						return "S";
					case State.OPEN:
						return "O";
					case State.VISITED:
						return "V";
				}
			}));
		}
	}

	private copyMazeState(): MazeGrid {
		if (!this.maze){
			throw Error();
		}

		const mazeCopy: MazeGrid = [];
		for (let i = 0; i < this._rowCount; i++) {
			mazeCopy.push([]);
			for (let j = 0; j < this._colCount; j++) {
				mazeCopy[i].push(this.maze[i][j]);
			}
		}

		return mazeCopy;
	}

	public solveMaze() {
		if (!this.maze || !this._pathFinder) {
			throw Error();
		}

		if (!this._pathFinder.startPoint) {		
			this._pathFinder.startPoint = this.startPoint;
		}

		const mazeCopy = this.copyMazeState();
		const result: GameState = this._pathFinder.findPath(mazeCopy, this._rowCount, this._colCount, this._startPoint, this._observers);
		for (let observer of this._observers) {
			observer.update(mazeCopy, result !== GameState.SOLVED ? GameState.NO_SOLUTION : result);
		}
	};
}