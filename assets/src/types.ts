// type of a 10x10 *grid*
// *tiles* can be "none" | "sand" | "grass" |
export type Tile = "n" | "S" | "G";

// a *line* contains 8 *tiles*
export type Line = [Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile];

// a *grid* is 8 *lines*
export type Grid = [Line, Line, Line, Line, Line, Line, Line, Line, Line, Line];

export type Coord = {
  x: number;
  y: number;
};

export type Direction = "N" | "S" | "W" | "E";

// *entities* can be "empty" | "enemy" | "cross/treasure"
export type Entity = "n" | "E" | "X";

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

export type Player = {
  coords: Coord;
  direction: Direction;
};

// lesson
export type Lesson = {
  grid: Grid;
  entities: EntityGrid;
  player: Player;
};
