export function configureSlider(target: HTMLElement, root: HTMLElement) {
  let offset = 0;

  function beginSliding(e: PointerEvent) {
    target.onpointermove = slide;
    target.setPointerCapture(e.pointerId);
    offset =
      e.clientX -
      target.getBoundingClientRect().left +
      root.getBoundingClientRect().left;
  }

  function stopSliding(e: PointerEvent) {
    target.onpointermove = null;
    target.releasePointerCapture(e.pointerId);
  }

  function slide(e: PointerEvent) {
    const position = e.clientX - offset;
    target.style.left = position + "px";
  }

  target.onpointerdown = beginSliding;
  target.onpointerup = stopSliding;
}
