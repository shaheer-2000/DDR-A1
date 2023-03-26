export enum DIRECTION {
	NORTH,
	SOUTH,
	EAST,
	WEST
}

export enum STATE {
	OPEN,
	BLOCKED,
	START,
	END,
	VISITED
}

export enum GAMESTATE {
	UNSOLVED,
	SOLVING,
	BACKTRACKING,
	SOLVED,
	NO_SOLUTION
}

export type Point = [number, number];
export type MazeGrid = STATE[][];
