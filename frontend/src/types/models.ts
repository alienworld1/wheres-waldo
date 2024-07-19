export interface Position {
  x: number;
  y: number;
}

interface Target {
  name: string;
  position: Position;
  _id: string;
}

export interface Photo {
  name: string;
  targets: Target[];
  userFriendlyName: string;
  _id: string;
  __v: never;
  width: number;
  height: number;
}
