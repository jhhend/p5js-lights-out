
// Classes

class LightsOutGrid {
  constructor(size) {
    this.size = size;
    this.grid = new Array(this.size).fill(0).map(v => new Array(this.size).fill(false) );
  }

  isSolved() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  move(i, j) {
    if (i - 1 >= 0) { this.toggle(i - 1, j); }

    if (i + 1 < CELL_COUNT) { this.toggle(i + 1, j); }

    if (j - 1 >= 0) { this.toggle(i, j - 1); }

    if (j + 1 < CELL_COUNT) { this.toggle(i, j + 1); }    

    this.toggle(i, j);
  }

  randomize() {
    for (let i = 0; i < 50; i++) {
      this.move(Math.floor(random(this.size)), Math.floor(random(this.size)));
    }
  }

  toggle(i, j) {
    this.grid[i][j] = !this.grid[i][j];
  }

  draw() {    
    for (let i = 0; i < CELL_COUNT; i++) {
      for (let j = 0; j < CELL_COUNT; j++) {
        if (state === State.Win) {
          fill(color(360*((frameCount % 360) / 360), 50, 100));
        } else {
          fill(this.grid[i][j] ? 'yellow' : 'white');
        }
        let x = CELL_BUFFER + j*CELL_SIZE + j*CELL_BUFFER;
        let y = CELL_BUFFER + i*CELL_SIZE + i*CELL_BUFFER;
        rect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }    
  }

  setupLevel(level) {
    this.grid = new Array(this.size).fill(0).map(v => new Array(this.size).fill(false) );
    
    let values = levels[level].map(v => parseInt(v).toString(2)).map(v => {
      while (v.length < 5) {
        v = `0${v}`
      }
      return v.split('').map(v => parseInt(v) === 0 ? false : true);
    });

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = values[i][j];
      }
    }
  }
}





// Global Constants

const CANVAS_SIZE = 512;
const CELL_COUNT = 5;
const CELL_BUFFER = 16;
const CELL_SIZE = (CANVAS_SIZE - (CELL_BUFFER*2) - (CELL_BUFFER*(CELL_COUNT - 1))) / CELL_COUNT//CANVAS_SIZE/CELL_COUNT;
const State = {
  Game : 0,
  Win : 1
};





// Global variables

let grid = new LightsOutGrid(CELL_COUNT);
let levels;
let currentLevel = 0;
let state = State.Game;





// p5.js functions

function preload() {
  loadJSON('./levels.json', (data) => {
    levels = data.levels;
  });
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  colorMode(HSB);

  grid.setupLevel(currentLevel);

  // Add level select dropdown
  levelSelect = createSelect()
  levels.forEach((lvl, idx) => {
    levelSelect.option(`Level ${idx + 1}`)
  });
  levelSelect.option('Random');
  levelSelect.changed(() => {

    if (levelSelect.value() === 'Random') {
      state = State.Game;
      grid.randomize();
      return;
    }

    currentLevel = parseInt(levelSelect.value().split(' ')[1]) - 1;
    state = State.Game;
    grid.setupLevel(currentLevel);
  });

}

function mousePressed() {

  if (state === State.Win) { 
    return;
  }

  for (let i = 0; i < CELL_COUNT; i++) {
    for (let j = 0; j < CELL_COUNT; j++) {
      let x = CELL_BUFFER + j*CELL_SIZE + j*CELL_BUFFER;
      let y = CELL_BUFFER + i*CELL_SIZE + i*CELL_BUFFER;

      if (mouseX < x || mouseX > x + CELL_SIZE) {
        continue;
      }

      if (mouseY < y || mouseY > y + CELL_SIZE) {
        continue;
      }

      grid.move(i, j);

      if (grid.isSolved()) {
        state = State.Win;
      }

      return;
    }
  }

}

function draw() {
  background(color(0, 0, 20));
  stroke(255)

  grid.draw();
}
