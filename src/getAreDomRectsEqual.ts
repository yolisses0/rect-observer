export function getAreDomRectsEqual(a: DOMRect, b: DOMRect) {
  return (
    a.bottom === b.bottom &&
    a.height === b.height &&
    a.left === b.left &&
    a.right === b.right &&
    a.top === b.top &&
    a.width === b.width &&
    a.x === b.x &&
    a.y === b.y
  );
}
