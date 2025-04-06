export function configureSlider(
  target: HTMLElement,
  root: HTMLElement,
  handler: HTMLElement
) {
  let offsetX = 0;
  let offsetY = 0;

  function beginSliding(e: PointerEvent) {
    handler.onpointermove = slide;
    handler.setPointerCapture(e.pointerId);

    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    offsetY = e.clientY - targetRect.top + rootRect.top;
    offsetX = e.clientX - targetRect.left + rootRect.left;
  }

  function stopSliding(e: PointerEvent) {
    handler.onpointermove = null;
    handler.releasePointerCapture(e.pointerId);
  }

  function slide(e: PointerEvent) {
    target.style.top = e.clientY - offsetY + "px";
    target.style.left = e.clientX - offsetX + "px";
  }

  handler.onpointerdown = beginSliding;
  handler.onpointerup = stopSliding;
}
