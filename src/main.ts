import './style.css'
import Renderer from './lib/rendering/Renderer'
import DefaultPathFinder from './lib/pathFinding/DefaultPathFinder';
import DFSPathFinder from './lib/pathFinding/DFSPathFinder';
import Maze from './lib/maze/Maze';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1 id="state-announcer">Click on the "Generate Maze" button</h1>
	<div class="input-bar">
		<select name="path-finder" id="path-finder">
			<option value="default">Default Search (Backtracking)</option>
			<option value="dfs">Depth-First Search</option>
		</select>
		<div class="input-container">
			<label>Row Count: <span id="row-count-val"></span></label>
			<input type="range" min="3" max="8" value="3" id="row-count" />
		</div>
		<div class="input-container">
			<label>Column Count: <span id="col-count-val"></span></label>
			<input type="range" min="3" max="8" value="3" id="col-count" />
		</div>
	</div>
	<div class="grid-container">
		<div id="grid"></div>
	</div>
    <div class="button-bar">
      <div class="card">
        <button id="generate-btn" type="button">Generate Maze</button>
      </div>
      <div class="card">
        <button id="solve-btn" type="button">Solve Maze</button>
      </div>
    </div>
  </div>
`;

function initializeView() {
	const grid = document.querySelector<HTMLDivElement>("#grid")!;
	const stateAnnHeading = document.querySelector<HTMLHeadingElement>("#state-announcer")!;
	const solveBtn = document.querySelector<HTMLButtonElement>('#solve-btn')!;
	const generateBtn = document.querySelector<HTMLButtonElement>("#generate-btn")!;
	const pathFindingDropdown = document.querySelector<HTMLSelectElement>("#path-finder")!;
	const rowCountSlider = document.querySelector<HTMLInputElement>("#row-count")!;
	const colCountSlider = document.querySelector<HTMLInputElement>("#col-count")!;
	const rowCountVal = document.querySelector<HTMLSpanElement>("#row-count-val")!;
	const colCountVal = document.querySelector<HTMLSpanElement>("#col-count-val")!;

	const DFS = "dfs";

	let pathFinder = new DefaultPathFinder();
	let rowCount = 3;
	let colCount = 3;
	const hurdleRatio = (1 / 3);

	const maze = new Maze(pathFinder, rowCount, colCount, hurdleRatio);
	const renderer = new Renderer(grid, stateAnnHeading);

	function attachRenderer() {
		maze.addObserver(renderer);
		renderer.drawGrid();
	}

	attachRenderer();

	rowCountVal.innerText = `${rowCount}`;
	colCountVal.innerText = `${colCount}`;

	// Event Listener
	generateBtn.addEventListener("click", () => {
		// renderer.clearTimerInterval();
		maze.generateMaze(rowCount, colCount, hurdleRatio);
	});

	solveBtn.addEventListener("click", () => {
		// renderer.clearTimerInterval();
		maze.solveMaze();
	});

	rowCountSlider.addEventListener("change", (e) => {
		const selectedVal = Number((e as any).target.value);
		rowCount = selectedVal;
		renderer.rowCount = rowCount;
		renderer.drawGrid();
		rowCountVal.innerText = `${rowCount}`;
	});

	colCountSlider.addEventListener("change", (e) => {
		const selectedVal = Number((e as any).target.value);
		colCount = selectedVal;
		renderer.colCount = colCount;
		renderer.drawGrid();
		colCountVal.innerText = `${colCount}`;
	});

	pathFindingDropdown.addEventListener("change", (e) => {
		const selectedVal = (e as any).currentTarget?.value;
		maze.pathFinder = selectedVal === DFS ? new DFSPathFinder() : new DefaultPathFinder();
		renderer.drawGrid(maze.mazeState);
	});
}

initializeView();
