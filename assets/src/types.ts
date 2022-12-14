// type of a 10x10 *grid*
// *tiles* can be "none" | "sand" | "wood"
export type Tile = "n" | "S" | "W";

// a *line* contains 8 *tiles*
export type Line = [Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile];

// a *grid* is 8 *lines*
export type Grid = [Line, Line, Line, Line, Line, Line, Line, Line, Line, Line];

export type Coords = {
  x: number;
  y: number;
};

export type Direction = "N" | "S" | "W" | "E";

// *entities* can be "empty" | "enemy" | "bottle" | "treasure" | "palm-tree"
export type Entity = "n" | "E" | "X" | "T" | "P";

export type EntityLine = [
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
  Entity,
];

export type EntityGrid = [
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
  EntityLine,
];

export type PlayerEntity = {
  coords: Coords;
  direction: Direction;
  onShip?: boolean;
};

// lesson
export type Lesson = {
  grid: Grid;
  entities: EntityGrid;
  player: PlayerEntity;
  ship?: PlayerEntity;
  noSuccess?: boolean;
};
