export interface Box2D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function checkAABBOverlap(a: Box2D, b: Box2D): boolean {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY
  );
}
