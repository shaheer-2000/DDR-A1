import MazeObserver from "./MazeObserver";
import { GAMESTATE as GameState, MazeGrid, STATE as State } from "../../types/types";

export default class Renderer implements MazeObserver {
	private grid: HTMLDivElement;
	private _rowCount: number = 3;
	private _colCount: number = 3;
	private gridCells: HTMLDivElement[][];
	private cellStateColorMap = {
		[State.OPEN]: "",
		[State.BLOCKED]: "red",
		[State.END]: "blue",
		[State.START]: "green",
		[State.VISITED]: "yellow"
	};
	private cellStateSymbolMap = {
		[State.OPEN]: "O",
		[State.BLOCKED]: "B",
		[State.END]: "E",
		[State.START]: "S",
		[State.VISITED]: "V"
	};
	private stateAnnouncerHeading: HTMLHeadingElement;
	// private timerInterval: number = 0;
	// private _paintSpeed = 1.5; // seconds

	constructor(grid: HTMLDivElement, stateAnnouncerHeading: HTMLHeadingElement) {
		this.grid = grid;
		this.gridCells = [];
		this.stateAnnouncerHeading = stateAnnouncerHeading;
	}

	public set rowCount(rowCount: number) {
		this._rowCount = rowCount;
	}

	public set colCount(colCount: number) {
		this._colCount = colCount;
	}

	// public clearTimerInterval() {
	// 	this.timerInterval = 0;
	// }

	public drawGrid(mazeState?: MazeGrid) {
		this.grid.innerHTML = "";
		for (let i = 0; i < this._rowCount; i++) {
			this.gridCells.push([]);
			const rowElement = document.createElement("div");
			rowElement.id = "row";
			for (let j = 0; j < this._colCount; j++) {
				const cellElement = document.createElement("div");
				cellElement.className = "cell";
				cellElement.innerText = "O";
				this.gridCells[i].push(cellElement);
				rowElement.appendChild(cellElement);
				if (mazeState) {
					const prevClass = cellElement.classList.item(1);
					if (prevClass !== null) {
						cellElement.classList.remove(prevClass);
					}
					if (mazeState[i][j] !== State.OPEN) {
						cellElement.classList.add(this.cellStateColorMap[mazeState[i][j]]);
					}
					cellElement.innerText = this.cellStateSymbolMap[mazeState[i][j]];
				}
			}
			this.grid.appendChild(rowElement);
		}
	}

	public update(mazeState: MazeGrid, gameState: GameState) {
		// TODO: Add support for throttling
/* 		console.log(gameState === GameState.SOLVING ? "SOLVING" : "OTHER")
		const timerId = setTimeout(() => {
			this._update(mazeState, gameState);
			console.log((this._paintSpeed + (2 * this.timerInterval)) * 1000);
		}, gameState === GameState.UNSOLVED ? 0 : (this._paintSpeed + (2 * this.timerInterval)) * 1000);
		this.timerInterval++;
		console.log(this.timerInterval); */
		this._update(mazeState, gameState);
	}

	private _update(mazeState: MazeGrid, gameState: GameState) {
		this.stateAnnouncerHeading.innerText = (
			gameState === GameState.UNSOLVED ? "Click on \"Solve Maze\" to find a solution" :
			gameState === GameState.SOLVED ? "A solution has been found!" :
			gameState === GameState.NO_SOLUTION ? "No solution could be found..." :
			gameState === GameState.SOLVING ? "Solving..." :
			"How did we get here?"
		);
		this.drawGrid(mazeState);
	}
}
