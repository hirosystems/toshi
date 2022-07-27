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

// *entities* can be "empty" | "player" | "enemy" | "stx" |
export type Entity = "n" | "P" | "E" | "S";

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
