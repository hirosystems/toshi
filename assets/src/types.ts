// type of a 10x10 *grid*
// *tiles* can be "empty" or "sand" or "grass"
export type Tile = "e" | "s" | "g";
// a *line* contains 8 *tiles*
export type Line = [Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile];
// a *grid* is 8 *lines*
export type Grid = [Line, Line, Line, Line, Line, Line, Line, Line, Line, Line];

export type Coord = {
  x: number;
  y: number;
};
